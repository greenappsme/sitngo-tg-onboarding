<template>
  <primitive-slide v-bind="props" @on-click="onSubmit">
    <p v-if="carousel && pagination === 'count'" :class="$style.count">
      {{ slideCount }}
    </p>

    <h2 v-html="i18nTitle" :class="$style.title" />

    <p
      v-if="i18nDescription"
      v-html="i18nDescription"
      :class="$style.description"
    />

    <form :class="$style.form" @submit.prevent>
      <div v-for="control in formControls" :key="control.id" :class="$style.control">
        <checkbox-block
          v-if="control.type === 'checkbox'"
          v-bind="control"
          :model-value="!!generatedForm[control.id]"
          @update:model-value="onUpdate(control.id, $event)"
        />

        <div v-else-if="control.type === 'select'" :class="$style.field">
          <label :for="control.id" :class="$style.label">
            {{ control.placeholder }}
          </label>

          <select
            :id="control.id"
            :class="$style.select"
            :value="String(generatedForm[control.id] ?? '')"
            @change="onSelectChange(control.id, $event)"
          >
            <option
              v-for="option in getSubmitFormOptions(control)"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div v-else-if="control.type === 'radio'" :class="$style.field">
          <p :class="$style.label">{{ control.placeholder }}</p>

          <checkbox-block
            v-for="option in getSubmitFormOptions(control)"
            :key="option.value"
            :id="`${control.id}_${option.value}`"
            :placeholder="option.label"
            :model-value="generatedForm[control.id] === option.value"
            @update:model-value="onRadioSelect(control.id, option.value, $event)"
          />
        </div>

        <div v-else-if="control.type === 'date'" :class="$style.field">
          <p :class="$style.label">{{ control.placeholder }}</p>

          <div :class="$style.dateRow">
            <select
              :class="$style.datePart"
              :value="getDatePart(control.id, 'day')"
              @change="onDatePartChange(control.id, 'day', $event)"
            >
              <option
                v-for="option in getDayOptionsForField(control.id)"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <select
              :class="$style.datePart"
              :value="getDatePart(control.id, 'month')"
              @change="onDatePartChange(control.id, 'month', $event)"
            >
              <option
                v-for="option in MONTH_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <select
              :class="$style.datePart"
              :value="getDatePart(control.id, 'year')"
              @change="onDatePartChange(control.id, 'year', $event)"
            >
              <option
                v-for="option in yearOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <input-text
          v-else-if="control.type === 'number'"
          v-bind="control"
          type="number"
          inputmode="decimal"
          :model-value="generatedForm[control.id]"
          @update:model-value="onUpdate(control.id, $event)"
        />

        <input-text
          v-else
          v-bind="control"
          :model-value="generatedForm[control.id]"
          @update:model-value="onUpdate(control.id, $event)"
        />
      </div>
    </form>
  </primitive-slide>
</template>

<script setup lang="ts">
import { PrimitiveSlide } from '@tok/generation/components/PrimitiveSlide';
import {
  FormPresetDefaultProps,
  FormPresetProps,
} from '@tok/generation/presets/form';
import { FORM_STATE_TOKEN } from '@tok/generation/tokens';
import { useCarousel } from '@tok/generation/use/carousel';
import { useI18n } from '@tok/i18n';
import { useTelegramSdk } from '@tok/telegram-ui/use/sdk';
import { CheckboxBlock } from '@tok/ui/components/CheckboxBlock';
import { InputText } from '@tok/ui/components/InputText';
import { useAlerts } from '@tok/ui/use/alerts';
import { computed, inject, onBeforeUnmount, reactive, toRefs } from 'vue';

import { hasBookingApiUrl, submitBookingRequest } from './submitBookingRequest';
import {
  addDaysToIsoDate,
  buildIsoDate,
  DEFAULT_RENTAL_DURATION_DAYS,
  getDayOptions,
  getSubmitFormInitialValue,
  getSubmitFormOptions,
  getYearOptions,
  isDateBefore,
  MONTH_OPTIONS,
  normalizeDateParts,
  parseIsoDate,
  RENTAL_END_DATE_ID,
  RENTAL_START_DATE_ID,
  SubmitFormControl,
} from './submitForm.types';

const props = withDefaults(
  defineProps<FormPresetProps>(),
  FormPresetDefaultProps
);

const { title, description, form, pagination } = toRefs(props);

const formControls = computed(() => form.value as SubmitFormControl[]);
const yearOptions = getYearOptions();

const i18n = useI18n();
const sdk = useTelegramSdk();
const carousel = useCarousel();
const alertsService = useAlerts({ autoCloseOnUnmount: true });
const formState = inject(FORM_STATE_TOKEN, null);

const i18nTitle = i18n.useTranslated(title);
const i18nDescription = i18n.useTranslated(description);

const slideCount = computed(() => {
  if (!carousel) {
    return null;
  }

  return `${carousel.index.value + 1} / ${carousel.length.value}`;
});

const stateValue = formState?.state;

const reactiveValue = formControls.value.reduce(
  (acc, control) => {
    acc[control.id] = getSubmitFormInitialValue(
      control,
      stateValue?.value[control.id]
    );

    return acc;
  },
  {} as Record<string, unknown>
);

formState?.update(reactiveValue);

const generatedForm = reactive<Record<string, unknown>>(reactiveValue);

const onUpdate = (id: string, value: unknown) => {
  generatedForm[id] = value;

  formState?.update({ [id]: value });
};

const onSelectChange = (id: string, event: Event) => {
  const target = event.target as HTMLSelectElement;

  onUpdate(id, target.value);
};

const onRadioSelect = (id: string, value: string, checked: boolean) => {
  if (checked) {
    onUpdate(id, value);
  }
};

const getDatePart = (fieldId: string, part: 'day' | 'month' | 'year') => {
  const isoDate = String(generatedForm[fieldId] ?? '');

  return parseIsoDate(isoDate)[part];
};

const getDayOptionsForField = (fieldId: string) => {
  const { year, month } = parseIsoDate(String(generatedForm[fieldId] ?? ''));

  return getDayOptions(year, month);
};

const syncEndDateAfterStartChange = (startDate: string) => {
  const endDate = String(generatedForm[RENTAL_END_DATE_ID] ?? '');

  if (!endDate || isDateBefore(endDate, startDate)) {
    onUpdate(
      RENTAL_END_DATE_ID,
      addDaysToIsoDate(startDate, DEFAULT_RENTAL_DURATION_DAYS)
    );
  }
};

const onDatePartChange = (
  fieldId: string,
  part: 'day' | 'month' | 'year',
  event: Event
) => {
  const target = event.target as HTMLSelectElement;
  const currentParts = parseIsoDate(String(generatedForm[fieldId] ?? ''));
  const nextParts = normalizeDateParts({
    ...currentParts,
    [part]: target.value,
  });
  const nextDate = buildIsoDate(nextParts);

  onUpdate(fieldId, nextDate);

  if (fieldId === RENTAL_START_DATE_ID) {
    syncEndDateAfterStartChange(nextDate);
  }
};

let alertTimeout: ReturnType<typeof setTimeout> | undefined;

const onSubmit = async () => {
  const payload = formState
    ? { ...formState.state.value }
    : { ...generatedForm };

  try {
    const result = await submitBookingRequest(sdk, payload);

    if (result === 'failed') {
      alertsService.show('Не удалось отправить заявку. Попробуйте ещё раз.', {
        type: 'error',
      });

      return;
    }

    if (result === 'sendData' && !hasBookingApiUrl()) {
      alertTimeout = setTimeout(() => {
        alertsService.show(
          'Метод sendData доступен только при запуске Mini App через кнопку клавиатуры бота',
          {
            type: 'telegram',
          }
        );
      }, 500);
    }

    sdk.close();
  } catch {
    alertsService.show('Ошибка сети при отправке заявки', {
      type: 'error',
    });
  }
};

onBeforeUnmount(() => {
  alertTimeout && clearTimeout(alertTimeout);
});
</script>

<style lang="scss" module>
.count {
  font: var(--tok-font-s);
  color: var(--tok-text-color-64);
  padding-top: 0.5rem;
}

.title {
  font: var(--tok-font-h2);
}

.description {
  font: var(--tok-font-m);
  color: var(--tok-text-color-64);
}

.form {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.control {
  width: 100%;
  max-width: 100%;
  min-width: 0;

  &:not(:first-child) {
    margin-top: 1.25rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.label {
  font: var(--tok-font-m);
  color: var(--tok-text-color);
}

.select,
.datePart {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.875rem 0.75rem;
  border: 1px solid var(--tok-border-color, rgba(0, 0, 0, 0.12));
  border-radius: 0.75rem;
  background: var(--tok-background-color);
  color: var(--tok-text-color);
  font: var(--tok-font-m);
  outline: none;

  &:focus {
    border-color: var(--tok-primary);
  }
}

.dateRow {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}
</style>
