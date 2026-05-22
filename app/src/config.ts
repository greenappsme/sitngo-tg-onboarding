import { defineConfig } from '@tok/generation';

import SubmitFormSlide from './custom/SubmitFormSlide.vue';

export default defineConfig({
  theme: 'light',

  definePresets: {
    submit_form: SubmitFormSlide,
  },

  pages: [
    {
      slides: [
        {
          media: {
            type: 'image',
            src: import(
              './assets/telegram-animated-emojis/Travel and Places/Automobile.webp'
            ),
            static: true,
            style: 'max-height: 200px; width: 200px; margin: 10px auto; aspect-ratio: 1/1;',
          },
          shape: 'square',
          pagination: 'count',
          textAlign: 'center',
          title: 'Сел и Поехал',
          description:
            'Аренда автомобилей в <b>Черногории</b> с 2010 года.<br><br>Более <b>200</b> современных авто - от эконом до премиум. Офисы в <b>Будве</b>, <b>Тивате</b> и <b>Подгорице</b>.<br><br>Просто <b>сели и поехали</b> исследовать страну!',
          button: 'Далее',
        },

        {
          media: {
            type: 'image',
            src: import(
              './assets/telegram-animated-emojis/Animals and Nature/Glowing Star.webp'
            ),
            static: true,
            style: 'max-height: 200px; width: 200px; margin: 10px auto; aspect-ratio: 1/1;',
          },
          shape: 'square',
          pagination: 'count',
          title: 'Почему выбирают нас',
          description:
            '14 лет на рынке · рейтинг Google <b>5.0</b> · более <b>800</b> отзывов',
          list: [
            {
              media: { type: 'emodji', src: '💰', size: 28 },
              text: '<b>Без предоплаты</b> - не блокируем депозит на карте',
            },
            {
              media: { type: 'emodji', src: '✈️', size: 28 },
              text: '<b>Встреча в аэропорту</b> с табличкой',
            },
            {
              media: { type: 'emodji', src: '🗣️', size: 28 },
              text: '<b>Русскоязычные менеджеры</b> на всех этапах бронирования и во время поездки',
            },
          ],
          button: 'Далее',
        },

        {
          media: {
            type: 'image',
            src: import('./assets/telegram-animated-emojis/Activity/Sparkles.webp'),
            static: true,
            style: 'max-height: 200px; width: 200px; margin: 10px auto; aspect-ratio: 1/1;',
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
            type: 'image',
            src: import(
              './assets/telegram-animated-emojis/Travel and Places/Compass.webp'
            ),
            static: true,
            style: 'max-height: 200px; width: 200px; margin: 10px auto; aspect-ratio: 1/1;',
          },
          shape: 'square',
          pagination: 'count',
          title: 'Как арендовать',
          description: 'От заявки до дороги — быстро и без лишних формальностей',
          list: [
            {
              media: { type: 'emodji', src: '🚗', size: 28 },
              text: 'Выберите авто и даты',
            },
            {
              media: { type: 'emodji', src: '✅', size: 28 },
              text: 'Менеджер предложит вам варианты и подтвердит бронь <b>без предоплаты</b>',
            },
            {
              media: { type: 'emodji', src: '✈️', size: 28 },
              text: 'Встретим в аэропорту или <b>доставим авто</b> к отелю в любой город Черногории',
            },
            {
              media: { type: 'emodji', src: '📝', size: 28 },
              text: 'Осмотрите машину, подпишите договор и <b>оплатите</b> удобным способом',
            },
            {
              media: { type: 'emodji', src: '🏁', size: 28 },
              text: 'Получите инструктаж и отправляйтесь в путь!',
            },
          ],
          button: 'Далее',
        },

        {
          extends: 'submit_form',
          media: {
            type: 'image',
            src: import(
              './assets/telegram-animated-emojis/Objects/Incoming Envelope.webp'
            ),
            static: true,
            style: 'max-height: 200px; width: 200px; margin: 10px auto; aspect-ratio: 1/1;',
          },
          shape: 'square',
          pagination: 'count',
          title: 'Расскажите о поездке',
          description:
            'Заполните форму — заявка отправится менеджеру в чат с ботом',
          form: [
            {
              id: 'pickup_location',
              type: 'select',
              placeholder: 'Где получить авто',
              defaultValue: 'TIV',
              options: [
                { value: 'TGD', label: 'Аэропорт Подгорица' },
                { value: 'TIV', label: 'Аэропорт Тиват' },
                { value: 'BR', label: 'Бар' },
                { value: 'BE', label: 'Бечичи' },
                { value: 'BD', label: 'Будва' },
                { value: 'DJ', label: 'Дженовичи' },
                { value: 'IG', label: 'Игало' },
                { value: 'KO', label: 'Котор' },
                { value: 'LE', label: 'Лепетанье' },
                { value: 'PE', label: 'Петровац' },
                { value: 'PG', label: 'Подгорица' },
                { value: 'PR', label: 'Пржно' },
                { value: 'RF', label: 'Рафаиловичи' },
                { value: 'RI', label: 'Рисан' },
                { value: 'SV', label: 'Святой Стефан' },
                { value: 'ST', label: 'Сутоморе' },
                { value: 'TV', label: 'Тиват' },
                { value: 'UL', label: 'Ульцинь' },
                { value: 'HN', label: 'Херцег-Нови' },
              ],
            },
            {
              id: 'rental_start_date',
              placeholder: 'Дата начала аренды',
              type: 'date',
            },
            {
              id: 'rental_end_date',
              placeholder: 'Дата возврата',
              type: 'date',
            },
            {
              id: 'car_class',
              type: 'select',
              placeholder: 'Выберите класс автомобиля',
              defaultValue: 'any',
              options: [
                { value: 'any', label: 'Любой класс' },
                { value: 'economy', label: 'Эконом' },
                { value: 'standard', label: 'Стандарт' },
                { value: 'business', label: 'Бизнес' },
                { value: 'premium', label: 'Премиум' },
                { value: 'suv', label: 'SUV / Внедорожники' },
                { value: 'convertible', label: 'Кабриолеты' },
              ],
            },
            {
              id: 'transmission',
              type: 'radio',
              placeholder: 'Коробка передач',
              defaultValue: 'any',
              options: [
                { value: 'any', label: 'Любая' },
                { value: 'automatic', label: 'Автомат' },
                { value: 'manual', label: 'Ручная' },
              ],
            },
          ],
          button: 'Отправить заявку',
        },
      ],
    },
  ],
});
