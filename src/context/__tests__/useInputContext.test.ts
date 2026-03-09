import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import type { Plugin } from 'vue';
import StandaloneInput from './components/StandaloneInput.vue';
import StandaloneCheckbox from './components/StandaloneCheckbox.vue';
import InputInsideField from './components/InputInsideField.vue';
import TwoStandaloneInputs from './components/TwoStandaloneInputs.vue';
import { FormsPlugin } from '../../plugins/FormsPlugin';
import { en } from '../../locales/en';

const NAME_LABEL = 'Name';
const NAME_VALUE = 'John Doe';
const CHECKBOX_LABEL = 'Accept terms';
const RESET_BUTTON_TEXT = 'Reset';

const pluginConfig = {
  global: {
    plugins: [[FormsPlugin, { locales: { en } }] as [Plugin, object]]
  }
};

describe('useInputContext', () => {
  describe('Standalone mode (no Field ancestor)', () => {
    it('should return a complete FieldContext with all properties', () => {
      render(StandaloneInput, pluginConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id');
      expect(input).toHaveAttribute('name');
      expect(input).toHaveAttribute('aria-describedby');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should sync inputValue with the model', async () => {
      const user = userEvent.setup();

      render(StandaloneInput, pluginConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);

      expect(input).toHaveValue(NAME_VALUE);
    });

    it('should always report isValid as true', () => {
      render(StandaloneInput, pluginConfig);

      expect(screen.getByText('Valid')).toBeVisible();
    });

    it('should not show error', () => {
      render(StandaloneInput, pluginConfig);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should track isTouched after blur', async () => {
      const user = userEvent.setup();

      render(StandaloneInput, pluginConfig);

      expect(screen.queryByText('Touched')).not.toBeInTheDocument();

      const input = screen.getByLabelText(NAME_LABEL);
      await user.click(input);
      await user.tab();

      expect(await screen.findByText('Touched')).toBeVisible();
    });

    it('should track isDirty when value changes', async () => {
      const user = userEvent.setup();

      render(StandaloneInput, pluginConfig);

      expect(screen.queryByText('Dirty')).not.toBeInTheDocument();

      const input = screen.getByLabelText(NAME_LABEL);
      await user.type(input, 'a');

      expect(await screen.findByText('Dirty')).toBeVisible();
    });

    it('should reset value, isTouched and isDirty', async () => {
      const user = userEvent.setup();

      render(StandaloneInput, pluginConfig);

      const input = screen.getByLabelText(NAME_LABEL);
      const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

      await user.type(input, NAME_VALUE);
      await user.tab();

      expect(input).toHaveValue(NAME_VALUE);
      expect(screen.getByText('Touched')).toBeVisible();
      expect(screen.getByText('Dirty')).toBeVisible();

      await user.click(resetButton);

      expect(input).toHaveValue('');
      expect(screen.queryByText('Touched')).not.toBeInTheDocument();
      expect(screen.queryByText('Dirty')).not.toBeInTheDocument();
    });

    it('should generate unique IDs for multiple instances', () => {
      render(TwoStandaloneInputs, pluginConfig);

      const input1 = screen.getByLabelText('First');
      const input2 = screen.getByLabelText('Second');

      expect(input1.id).toBeTruthy();
      expect(input2.id).toBeTruthy();
      expect(input1.id).not.toBe(input2.id);
    });

    it('should link label to input via for/id', () => {
      render(StandaloneInput, pluginConfig);

      const input = screen.getByLabelText(NAME_LABEL);
      const label = screen.getByText(NAME_LABEL);

      expect(label).toHaveAttribute('for', input.id);
    });

    it('should link help text via aria-describedby', () => {
      render(StandaloneInput, pluginConfig);

      const input = screen.getByLabelText(NAME_LABEL);
      const helpText = screen.getByText('Enter your name');

      expect(input).toHaveAttribute('aria-describedby', helpText.id);
    });
  });

  describe('Boolean model (checkbox)', () => {
    it('should render standalone checkbox', () => {
      render(StandaloneCheckbox, pluginConfig);

      const checkbox = screen.getByLabelText(CHECKBOX_LABEL);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('should toggle boolean value', async () => {
      const user = userEvent.setup();

      render(StandaloneCheckbox, pluginConfig);

      const checkbox = screen.getByLabelText(CHECKBOX_LABEL);

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should track isDirty on checkbox toggle', async () => {
      const user = userEvent.setup();

      render(StandaloneCheckbox, pluginConfig);

      expect(screen.queryByText('Dirty')).not.toBeInTheDocument();

      const checkbox = screen.getByLabelText(CHECKBOX_LABEL);
      await user.click(checkbox);

      expect(await screen.findByText('Dirty')).toBeVisible();
    });

    it('should reset checkbox to initial value', async () => {
      const user = userEvent.setup();

      render(StandaloneCheckbox, pluginConfig);

      const checkbox = screen.getByLabelText(CHECKBOX_LABEL);
      const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(resetButton);
      expect(checkbox).not.toBeChecked();
      expect(screen.queryByText('Dirty')).not.toBeInTheDocument();
    });
  });

  describe('Inside a Field', () => {
    const fieldConfig = {
      ...pluginConfig,
      props: {
        validation: 'required|min:3',
        validationMessages: {
          required: 'Name required',
          min: ({ value }: { value: string }) => `Name must be at least ${value} characters long`
        }
      }
    };

    it('should use injected field context instead of standalone', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);

      expect(input).toHaveValue(NAME_VALUE);
    });

    it('should validate through the Field context', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText('Name required')).toBeVisible();
    });

    it('should show min validation error from Field', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, 'ab');
      await user.tab();

      expect(await screen.findByText('Name must be at least 3 characters long')).toBeVisible();
    });

    it('should track isTouched via Field context', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      expect(screen.queryByText('Touched')).not.toBeInTheDocument();

      await user.click(input);
      await user.tab();

      expect(await screen.findByText('Touched')).toBeVisible();
    });

    it('should track isDirty via Field context', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      expect(screen.queryByText('Dirty')).not.toBeInTheDocument();

      await user.type(input, 'a');

      expect(await screen.findByText('Dirty')).toBeVisible();
    });

    it('should be valid when input meets all rules', async () => {
      const user = userEvent.setup();

      render(InputInsideField, fieldConfig);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Valid')).toBeVisible();
      });
    });
  });
});
