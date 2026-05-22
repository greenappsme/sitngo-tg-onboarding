import hashlib
import hmac
import json
import os
from typing import Any, Awaitable, Callable, Dict
from urllib.parse import parse_qsl

from aiohttp import web
from telegram import Bot
from telegram.constants import ParseMode


def validate_init_data(init_data: str, bot_token: str) -> Dict[str, str]:
    parsed = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = parsed.pop("hash", None)

    if not received_hash:
        raise ValueError("Missing initData hash")

    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret_key = hmac.new(
        b"WebAppData", bot_token.encode(), hashlib.sha256
    ).digest()
    calculated_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if calculated_hash != received_hash:
        raise ValueError("Invalid initData signature")

    return parsed


def get_user_id_from_init_data(parsed: Dict[str, str]) -> int:
    user_raw = parsed.get("user")

    if not user_raw:
        raise ValueError("Missing user in initData")

    user = json.loads(user_raw)

    return int(user["id"])


def get_cors_headers(request: web.Request) -> Dict[str, str]:
    origin = request.headers.get("Origin", "")
    allowed_origins = os.getenv(
        "BOOKING_API_ALLOWED_ORIGINS",
        "https://greenappsme.github.io",
    ).split(",")

    normalized_allowed = {
        item.strip().rstrip("/") for item in allowed_origins if item.strip()
    }

    headers = {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if origin.rstrip("/") in normalized_allowed:
        headers["Access-Control-Allow-Origin"] = origin

    return headers


def create_booking_api_app(
    bot: Bot,
    bot_token: str,
    deliver_booking_request: Callable[[Bot, int, Dict[str, Any]], Awaitable[None]],
) -> web.Application:
    async def handle_options(request: web.Request) -> web.Response:
        return web.Response(status=204, headers=get_cors_headers(request))

    async def handle_booking(request: web.Request) -> web.Response:
        headers = get_cors_headers(request)

        try:
            body = await request.json()
            init_data = body.get("initData", "")
            payload = body.get("payload", {})

            if not isinstance(payload, dict):
                raise ValueError("Invalid payload")

            parsed = validate_init_data(init_data, bot_token)
            user_id = get_user_id_from_init_data(parsed)

            await deliver_booking_request(bot, user_id, payload)

            return web.json_response({"ok": True}, headers=headers)
        except Exception as error:
            return web.json_response(
                {"ok": False, "error": str(error)},
                status=400,
                headers=headers,
            )

    app = web.Application()
    app.router.add_route("OPTIONS", "/api/booking", handle_options)
    app.router.add_post("/api/booking", handle_booking)

    return app


async def start_booking_api(
    application,
    deliver_booking_request: Callable[[Bot, int, Dict[str, Any]], Awaitable[None]],
) -> None:
    port = int(os.getenv("BOOKING_API_PORT", "8787"))
    host = os.getenv("BOOKING_API_HOST", "127.0.0.1")
    bot_token = application.bot.token

    app = create_booking_api_app(
        application.bot,
        bot_token,
        deliver_booking_request,
    )

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()

    application.bot_data["booking_api_runner"] = runner
    print(f"Booking API listening on http://{host}:{port}/api/booking")


async def stop_booking_api(application) -> None:
    runner = application.bot_data.get("booking_api_runner")

    if runner:
        await runner.cleanup()
