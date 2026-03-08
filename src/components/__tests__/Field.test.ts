import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import ExampleField from './components/ExampleField.vue';
import { describe } from 'vitest';
import { FormsPlugin } from '../../plugins/FormsPlugin';
import { en } from '../../locales/en';
import { es } from '../../locales/es';
import type { Plugin } from 'vue';

const NAME_LABEL = 'Name';
const NAME_VALUE = 'John Doe';
const NAME_HELP_TEXT = 'Write your full name';
const NAME_REQUIRED_ERROR = 'Name required';
const NAME_MIN_LENGTH_ERROR = 'Name must be at least 3 characters long';

const RESET_BUTTON_TEXT = 'Reset';

const config = {
  props: {
    validation: 'required|min:3',
    validationMessages: {
      required: 'Name required',
      min: ({ value }: { value: string }) => `Name must be at least ${value} characters long`
    }
  },
  global: {
    plugins: [[FormsPlugin, { locales: { en } }] as [Plugin, object]]
  }
};

describe('Field', () => {
  describe('Basic Interaction', () => {
    it('should fill field when typing in it', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);

      expect(input).toHaveValue(NAME_VALUE);
    });

    it('should clear field when clearing it', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);
      expect(input).toHaveValue(NAME_VALUE);

      await user.clear(input);
      expect(input).toHaveValue('');
    });

    it('should be touched when typing in the field', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.click(input);
      await user.tab();

      expect(await screen.findByText('Touched')).toBeVisible();
    });

    it('should be dirty when typing in the field', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);

      expect(await screen.findByText('Dirty')).toBeVisible();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset field value when reset function is called', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);
      const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

      await user.type(input, NAME_VALUE);

      expect(input).toHaveValue(NAME_VALUE);

      await user.click(resetButton);

      expect(input).toHaveValue('');
    });

    it('should reset field with initial value', async () => {
      const user = userEvent.setup();

      render(ExampleField, {
        global: config.global,
        props: {
          ...config.props,
          initialValue: NAME_VALUE
        }
      });

      const input = screen.getByLabelText(NAME_LABEL);
      const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

      expect(input).toHaveValue(NAME_VALUE);

      await user.clear(input);
      await user.click(resetButton);

      expect(input).toHaveValue(NAME_VALUE);
    });
  });

  describe('Validation', () => {
    describe('Basic validation', () => {
      it('should be valid when value is valid', async () => {
        const user = userEvent.setup();
        const validText = 'Valid';

        render(ExampleField, config);

        const input = screen.getByLabelText(NAME_LABEL);

        await user.type(input, NAME_VALUE);

        expect(await screen.findByText(validText)).toBeVisible();

        await user.clear(input);

        await waitFor(() => {
          expect(screen.queryByText(validText)).not.toBeInTheDocument();
        });
      });

      it('should show validation errors when entering invalid value', async () => {
        const user = userEvent.setup();

        render(ExampleField, config);

        const input = screen.getByLabelText(NAME_LABEL);

        await user.type(input, 'J');

        expect(await screen.findByText(NAME_MIN_LENGTH_ERROR)).toBeVisible();
      });

      it('should clear validation errors when correcting the value', async () => {
        const user = userEvent.setup();

        render(ExampleField, config);

        const input = screen.getByLabelText(NAME_LABEL);

        await user.type(input, 'J');
        expect(await screen.findByText(NAME_MIN_LENGTH_ERROR)).toBeVisible();

        await user.type(input, 'oh');

        await waitFor(() => {
          expect(screen.queryByText(NAME_MIN_LENGTH_ERROR)).not.toBeInTheDocument();
        });
      });

      it('should validate when field loses focus after being touched', async () => {
        const user = userEvent.setup();

        render(ExampleField, config);

        const input = screen.getByLabelText(NAME_LABEL);

        expect(screen.queryByText(NAME_REQUIRED_ERROR)).not.toBeInTheDocument();

        await user.click(input);
        await user.tab();

        expect(await screen.findByText(NAME_REQUIRED_ERROR)).toBeVisible();
      });

      it('should not show validation error when resetting field', async () => {
        const user = userEvent.setup();

        render(ExampleField, config);

        const input = screen.getByLabelText(NAME_LABEL);
        const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

        await user.type(input, 'J');

        expect(await screen.findByText(NAME_MIN_LENGTH_ERROR)).toBeVisible();

        await user.click(resetButton);

        const requiredErrorVisiblePromise = waitFor(async () => {
          expect(await screen.findByText(NAME_REQUIRED_ERROR)).toBeVisible();
        });

        await expect(requiredErrorVisiblePromise).rejects.toThrow();
      });
    });

    describe('Rules', () => {
      describe('Required', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'This field is required';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'required' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'J');
          await user.clear(input);

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.type(input, 'Valid value');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Email', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Please enter a valid email address';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'email' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'invalid-email');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'valid@example.com');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Number', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be a valid number';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'number' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'not-a-number');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '123');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Accepted', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be accepted';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'accepted' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'no');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'yes');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Alpha', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only alphabetical characters';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'alpha' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'test123');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'onlyletters');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Alphanumeric', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only letters and numbers';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'alphanumeric' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'test@123');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'test123');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Alpha Spaces', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only letters and spaces';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'alphaSpaces' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'test 123');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'test letters');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Between', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be between 18 and 25';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'between:18,25' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '30');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '20');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Alpha', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one letter';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsAlpha' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '123456');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '123a456');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Alphanumeric', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one letter or number';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsAlphanumeric' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '!!!@@@');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '!!!a@@@');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Alpha Spaces', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one letter or space';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsAlphaSpaces' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '123456');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '123 456');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Lowercase', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one lowercase letter';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsLowercase' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'UPPERCASE');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'UPPERcASE');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Numeric', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one number';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsNumeric' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'onlyletters');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'letters123');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Symbol', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one symbol';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsSymbol' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'letters123');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'letters123!');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Contains Uppercase', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain at least one uppercase letter';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'containsUppercase' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'lowercase');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'lowerCase');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date After', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be after 2023-01-01';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateAfter:2023-01-01' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '2022-12-31');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2023-01-02');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date After Or Equal', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be after or equal to 2023-01-01';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateAfterOrEqual:2023-01-01' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '2022-12-31');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2023-01-01');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date Before', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be before 2023-01-01';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateBefore:2023-01-01' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '2023-01-02');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2022-12-31');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date Before Or Equal', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be before or equal to 2023-01-01';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateBeforeOrEqual:2023-01-01' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '2023-01-02');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2023-01-01');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date Between', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be between 2023-01-01 and 2023-12-31';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateBetween:2023-01-01,2023-12-31' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '2024-01-01');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2023-06-15');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Date Format', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must match the format YYYY-MM-DD';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'dateFormat:YYYY-MM-DD' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '01/01/2023');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '2023-01-01');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Ends With', () => {
        it('should validate single suffix correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must end with ".com"';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'endsWith:.com' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'example.org');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'example.com');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });

        it('should validate multiple suffixes correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must end with one of: ".com", ".org"';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'endsWith:.com,.org' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'example.net');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'example.org');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Is', () => {
        it('should validate single value correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be one of: admin';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'is:admin' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'user');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'admin');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });

        it('should validate multiple values correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be one of: yes, true, 1';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'is:yes,true,1' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'no');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'yes');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Length', () => {
        it('should validate exact length correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be exactly 5 characters';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'length:5' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'test');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'tests');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });

        it('should validate length range correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be between 3 and 8 characters';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'length:3,8' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'ab');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'valid');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Lowercase', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only lowercase characters';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'lowercase' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'Test');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'test');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Matches', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Format is not valid';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'matches:/^[0-9]+$/' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'abc');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '123');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Max', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be at most 10';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'max:10' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '15');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '8');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Min', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be at least 5';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'min:5' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, '3');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '7');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Not', () => {
        it('should validate single value correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must not be one of: admin';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'not:admin' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'admin');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'user');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });

        it('should validate multiple values correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must not be one of: admin, root';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'not:admin,root' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'admin');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'user');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Starts With', () => {
        it('should validate single prefix correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must start with "https://"';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'startsWith:https://' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'http://example.com');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'https://example.com');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });

        it('should validate multiple prefixes correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must start with one of: https://, http://';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'startsWith:https://,http://' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'ftp://example.com');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'http://example.com');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Symbol', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only symbols';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'symbol' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'abc123');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, '!@#$');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('Uppercase', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must contain only uppercase characters';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'uppercase' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'Test');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'TEST');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });

      describe('URL', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup();
          const errorMessage = 'Must be a valid URL';

          render(ExampleField, {
            global: config.global,
            props: { validation: 'url' }
          });

          const input = screen.getByLabelText(NAME_LABEL);

          await user.type(input, 'not-a-url');

          expect(await screen.findByText(errorMessage)).toBeVisible();

          await user.clear(input);
          await user.type(input, 'https://example.com');

          await waitFor(() => {
            expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should focus the field when clicking on the label', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const label = screen.getByText(NAME_LABEL);
      const input = screen.getByLabelText(NAME_LABEL);

      await user.click(label);

      expect(input).toHaveFocus();
    });

    it('should have help text associated with the field', async () => {
      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);
      const helpText = screen.getByText(NAME_HELP_TEXT);

      expect(helpText).toBeVisible();
      expect(input).toHaveAttribute('aria-describedby', helpText.id);
    });

    it('should have error text associated with the field', async () => {
      const user = userEvent.setup();

      render(ExampleField, config);

      const input = screen.getByLabelText(NAME_LABEL);

      await user.type(input, NAME_VALUE);
      await user.clear(input);

      const errorMessage = await screen.findByText(NAME_REQUIRED_ERROR);
      expect(errorMessage).toBeVisible();
      expect(errorMessage).toHaveAttribute('role', 'alert');

      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toContain(errorMessage.id);
    });
  });

  describe('Slot Props', () => {
    it('should provide all expected slot props with correct structure', () => {
      const name = 'test-field';

      render(ExampleField, {
        global: config.global,
        props: { name },
        slots: {
          default: (slotProps: Record<string, unknown>) => {
            expect(slotProps).toHaveProperty('inputValue');
            expect(slotProps).toHaveProperty('inputProps');
            expect(slotProps).toHaveProperty('labelProps');
            expect(slotProps).toHaveProperty('helpProps');
            expect(slotProps).toHaveProperty('errorProps');
            expect(slotProps).toHaveProperty('isValid');
            expect(slotProps).toHaveProperty('isTouched');
            expect(slotProps).toHaveProperty('isDirty');
            expect(slotProps).toHaveProperty('error');
            expect(slotProps).toHaveProperty('errors');
            expect(slotProps).toHaveProperty('validate');
            expect(slotProps).toHaveProperty('reset');

            expect(slotProps.labelProps).toEqual({ for: expect.any(String) });
            expect(slotProps.inputProps).toEqual({
              id: expect.any(String),
              name,
              modelValue: '',
              'aria-invalid': false,
              'aria-describedby': expect.any(String),
              'aria-errormessage': undefined,
              'onUpdate:modelValue': expect.any(Function),
              onBlur: expect.any(Function)
            });
            expect(slotProps.helpProps).toEqual({ id: expect.any(String) });
            expect(slotProps.errorProps).toEqual({
              id: expect.any(String),
              role: 'alert',
              'aria-live': 'polite'
            });
            expect(slotProps.isValid).toBe(true);
            expect(slotProps.isTouched).toBe(false);
            expect(slotProps.isDirty).toBe(false);
            expect(slotProps.error).toBe(null);
            expect(slotProps.errors).toEqual([]);
            expect(slotProps.validate).toBeInstanceOf(Function);
            expect(slotProps.reset).toBeInstanceOf(Function);

            return null;
          }
        }
      });
    });
  });

  describe('Localization', () => {
    it('should use localized validation messages', async () => {
      const user = userEvent.setup();

      render(ExampleField, {
        global: {
          plugins: [[FormsPlugin, { locale: 'es', locales: { es } }] as [Plugin, object]]
        },
        props: { validation: 'min:3' }
      });

      const input = screen.getByLabelText(NAME_LABEL);
      const changeLocaleButton = screen.getByRole('button', { name: 'Change locale' });

      await user.type(input, 'J');
      expect(await screen.findByText('Debe ser al menos 3')).toBeVisible();

      await user.click(changeLocaleButton);
      await user.type(input, 'o');

      expect(await screen.findByText('Must be at least 3')).toBeVisible();
    });
  });
});
