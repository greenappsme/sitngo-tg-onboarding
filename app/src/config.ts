import { defineConfig } from '@tok/generation';

export default defineConfig({
  theme: 'light',

  pages: [
    {
      slides: [
        {
          media: {
            type: 'emodji',
            src: '🚗',
            size: 120,
          },
          shape: 'square',
          pagination: 'count',
          textAlign: 'center',
          title: 'Сел и Поехал',
          description:
            'Аренда автомобилей в <b>Черногории</b> с 2010 года.<br><br>Более <b>200</b> современных авто — от эконом до премиум. Офисы в <b>Будве</b>, <b>Тивате</b> и <b>Подгорице</b>.<br><br>Просто сели — и поехали исследовать страну!',
          button: 'Далее',
        },

        {
          media: {
            type: 'emodji',
            src: '⭐',
            size: 100,
          },
          shape: 'square',
          pagination: 'count',
          title: 'Почему выбирают нас',
          description: '14 лет на рынке · рейтинг Google <b>5.0</b> · более <b>800</b> отзывов',
          list: [
            {
              media: { type: 'emodji', src: '💳', size: 28 },
              text: '<b>Без залога</b> — не блокируем депозит на карте',
            },
            {
              media: { type: 'emodji', src: '✈️', size: 28 },
              text: '<b>Встреча в аэропорту</b> с табличкой за 15 минут',
            },
            {
              media: { type: 'emodji', src: '💰', size: 28 },
              text: '<b>Без предоплаты</b> — бронируйте заранее онлайн',
            },
            {
              media: { type: 'emodji', src: '🗣️', size: 28 },
              text: '<b>Русскоязычные менеджеры</b> на всех этапах',
            },
          ],
          button: 'Далее',
        },

        {
          media: {
            type: 'emodji',
            src: '🏎️',
            size: 100,
          },
          shape: 'square',
          pagination: 'count',
          title: 'Автопарк на любой запрос',
          description: 'От <b>€25/день</b> — выберите класс под ваше путешествие',
          list: [
            {
              media: { type: 'icon', src: import('./assets/icons/guide.svg'), size: 28 },
              text: '<b>Эконом</b> — Toyota Yaris, Aygo, Suzuki Ignis',
            },
            {
              media: { type: 'icon', src: import('./assets/icons/track.svg'), size: 28 },
              text: '<b>Стандарт и SUV</b> — Corolla, Tucson, Vitara',
            },
            {
              media: { type: 'icon', src: import('./assets/icons/star.svg'), size: 28 },
              text: '<b>Бизнес и премиум</b> — BMW X5, Audi Q5, Mercedes',
            },
            {
              media: { type: 'icon', src: import('./assets/icons/time.svg'), size: 28 },
              text: '<b>Кабриолеты и минивэны</b> — Mustang, T6, Sharan',
            },
          ],
          button: 'Далее',
        },

        {
          extends: 'form',
          media: {
            type: 'emodji',
            src: '📋',
            size: 100,
          },
          shape: 'square',
          pagination: 'count',
          title: 'Расскажите о поездке',
          description:
            'Заполните форму — бот передаст данные менеджеру для подбора авто',
          form: [
            {
              id: 'pickup_location',
              placeholder: 'Где получить авто (аэропорт, город)',
              type: 'text',
            },
            {
              id: 'rental_dates',
              placeholder: 'Даты аренды (например, 1–10 июня)',
              type: 'text',
            },
            {
              id: 'car_economy',
              placeholder: 'Эконом / компакт',
              type: 'checkbox',
            },
            {
              id: 'car_suv',
              placeholder: 'SUV / внедорожник',
              type: 'checkbox',
            },
            {
              id: 'car_premium',
              placeholder: 'Премиум / кабриолет',
              type: 'checkbox',
            },
            {
              id: 'car_minivan',
              placeholder: 'Минивэн / семейный',
              type: 'checkbox',
            },
          ],
          button: 'Далее',
        },

        {
          media: {
            type: 'emodji',
            src: '🛡️',
            size: 100,
          },
          shape: 'square',
          pagination: 'count',
          title: 'Всё уже включено',
          description: 'Никаких скрытых доплат за базовые услуги',
          list: [
            {
              media: { type: 'emodji', src: '📄', size: 28 },
              text: '<b>ОСАГО</b> и <b>Грин-карта</b> для выезда за границу',
            },
            {
              media: { type: 'emodji', src: '👶', size: 28 },
              text: '<b>Детское кресло</b> — одно бесплатно',
            },
            {
              media: { type: 'emodji', src: '👥', size: 28 },
              text: '<b>Второй водитель</b> без дополнительной оплаты',
            },
            {
              media: { type: 'emodji', src: '🛣️', size: 28 },
              text: '<b>Без ограничения пробега</b> на весь срок аренды',
            },
          ],
          button: 'Далее',
        },

        {
          media: {
            type: 'emodji',
            src: '🗺️',
            size: 100,
          },
          shape: 'square',
          pagination: 'count',
          title: 'Как арендовать',
          description: 'От заявки до дороги — быстро и без лишних формальностей',
          list: [
            'Выберите авто и даты на <a href="https://sitngo.me/" target="_blank">sitngo.me</a>',
            'Менеджер подтвердит бронь <b>без предоплаты</b>',
            'Встретим в аэропорту или <b>бесплатно доставим</b> авто',
            'Осмотрите машину, подпишите договор и <b>оплатите</b> удобным способом',
            'Получите инструктаж и отправляйтесь в путь!',
          ],
          button: 'Далее',
        },

        {
          media: {
            type: 'emodji',
            src: '🔑',
            size: 120,
          },
          shape: 'square',
          pagination: 'count',
          textAlign: 'center',
          title: 'Готовы в дорогу?',
          description:
            'Забронируйте автомобиль на <a href="https://sitngo.me/" target="_blank"><b>sitngo.me</b></a> — менеджер свяжется с вами в ближайшее время.<br><br>Нужна машина сегодня или завтра? Напишите нам в Telegram — подберём лучший вариант.<br><br>📞 <b>+382 69 31-32-33</b><br>✉️ <a href="mailto:info@sitngo.me">info@sitngo.me</a>',
          button: 'Забронировать авто',
        },
      ],
    },
  ],
});
