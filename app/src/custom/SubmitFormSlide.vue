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

    <form @submit.prevent>
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
  getSubmitFormInitialValue,
  getSubmitFormOptions,
  SubmitFormControl,
} from './submitForm.types';

const props = withDefaults(
  defineProps<FormPresetProps>(),
  FormPresetDefaultProps
);

const { title, description, form, pagination } = toRefs(props);

const formControls = computed(() => form.value as SubmitFormControl[]);

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

.control:not(:first-child) {
  margin-top: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label {
  font: var(--tok-font-m);
  color: var(--tok-text-color);
}

.select {
  width: 100%;
  padding: 0.875rem 1rem;
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
</style>
