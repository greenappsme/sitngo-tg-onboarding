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
      <div v-for="control in form" :key="control.id" :class="$style.control">
        <checkbox-block
          v-if="control.type === 'checkbox'"
          v-bind="control"
          :model-value="!!generatedForm[control.id]"
          @update:model-value="onUpdate(control.id, $event)"
        />

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
import type { _GenerationFormControlConfig } from '@tok/generation/defineConfig';
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

const props = withDefaults(
  defineProps<FormPresetProps>(),
  FormPresetDefaultProps
);

const { title, description, form, pagination } = toRefs(props);

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

const getInitValue = (control: _GenerationFormControlConfig) => {
  if (control.type === 'checkbox') {
    return stateValue?.value[control.id] ?? false;
  }

  return stateValue?.value[control.id] ?? null;
};

const reactiveValue = form.value.reduce(
  (acc, control) => {
    acc[control.id] = getInitValue(control);

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

let alertTimeout: ReturnType<typeof setTimeout> | undefined;

const onSubmit = () => {
  const payload = formState ? { ...formState.state.value } : { ...generatedForm };

  const data = JSON.stringify({
    payload,
    product: null,
  });

  sdk.sendData(data);

  alertTimeout = setTimeout(() => {
    alertsService.show(
      'Метод sendData доступен только при запуске Mini App через кнопку клавиатуры бота',
      {
        type: 'telegram',
      }
    );
  }, 500);

  sdk.close();
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
</style>
