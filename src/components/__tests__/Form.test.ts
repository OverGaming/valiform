import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import ExampleForm from './components/ExampleForm.vue'
import ExampleFormWithNestedFields from './components/ExampleFormWithNestedFields.vue'
import { FormsPlugin } from '../../plugins/FormsPlugin'

const NAME_LABEL = 'Name'
const NAME_VALUE = 'John Doe'
const NAME_MIN_ERROR = 'Must be at least 3'

const EMAIL_LABEL = 'Email'
const EMAIL_VALUE = 'test@example.com'
const EMAIL_FORMAT_ERROR = 'Please enter a valid email address'

const PASSWORD_LABEL = 'Password'
const PASSWORD_VALUE = 'Password1!'
const PASSWORD_CONTAIN_NUMBER_ERROR = 'Must contain at least one number'

const CONFIRM_PASSWORD_LABEL = 'Confirm Password'
const CONFIRM_PASSWORD_VALUE = 'Password1!'
const CONFIRM_PASSWORD_ERROR = 'Passwords do not match'

const VALID_TEXT = 'Valid'
const SUBMITTED_SUCCESSFULLY_TEXT = 'Form submitted successfully!'

const config = {
  global: {
    plugins: [FormsPlugin]
  }
}

describe('Form', () => {
  describe('Basic Field Interaction', () => {
    it('should fill field when typing in it', async () => {
      const user = userEvent.setup()

      render(ExampleForm, config)

      const input = screen.getByLabelText(NAME_LABEL)

      await user.type(input, NAME_VALUE)

      expect(input).toHaveValue(NAME_VALUE)
    })

    it('should clear field when clearing it', async () => {
      const user = userEvent.setup()

      render(ExampleForm, config)

      const input = screen.getByLabelText(NAME_LABEL)

      await user.type(input, NAME_VALUE)
      expect(input).toHaveValue(NAME_VALUE)

      await user.clear(input)
      expect(input).toHaveValue('')
    })
  })

  describe('Validation', () => {
    it('should work correctly', async () => {
      const user = userEvent.setup()

      render(ExampleForm, config)

      const nameInput = screen.getByLabelText(NAME_LABEL)
      const emailInput = screen.getByLabelText(EMAIL_LABEL)
      const passwordInput = screen.getByLabelText(PASSWORD_LABEL)
      const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL)

      expect(await screen.findByText(VALID_TEXT)).toBeVisible()

      await user.type(nameInput, 'J')

      await waitFor(() => {
        expect(screen.queryByText(VALID_TEXT)).not.toBeInTheDocument()
      })

      await user.clear(nameInput)

      await user.type(nameInput, NAME_VALUE)
      await user.type(emailInput, EMAIL_VALUE)
      await user.type(passwordInput, PASSWORD_VALUE)
      await user.type(confirmPasswordInput, CONFIRM_PASSWORD_VALUE)

      expect(await screen.findByText(VALID_TEXT)).toBeVisible()
    })

    describe('Rules', () => {
      describe('Confirm', () => {
        it('should validate rule correctly', async () => {
          const user = userEvent.setup()

          render(ExampleForm, {
            global: config.global
          })

          const passwordInput = screen.getByLabelText(PASSWORD_LABEL)
          const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL)

          await user.type(confirmPasswordInput, CONFIRM_PASSWORD_VALUE)

          expect(await screen.findByText(CONFIRM_PASSWORD_ERROR)).toBeVisible()

          await user.type(passwordInput, PASSWORD_VALUE)

          await waitFor(() => {
            expect(screen.queryByText(CONFIRM_PASSWORD_ERROR)).not.toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('Form Submission', () => {
    describe('Valid form', () => {
      it('should submit form with correct data', async () => {
        const user = userEvent.setup()

        render(ExampleForm, {
          global: config.global,
          props: {
            handleSubmit: (values: Record<string, unknown>) => {
              expect(values).toEqual({
                name: NAME_VALUE,
                email: EMAIL_VALUE,
                password: PASSWORD_VALUE,
                confirmPassword: CONFIRM_PASSWORD_VALUE
              })
            }
          }
        })

        const nameInput = screen.getByLabelText(NAME_LABEL)
        const emailInput = screen.getByLabelText(EMAIL_LABEL)
        const passwordInput = screen.getByLabelText(PASSWORD_LABEL)
        const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL)
        const submitButton = screen.getByRole('button', { name: /submit/i })

        await user.type(nameInput, NAME_VALUE)
        await user.type(emailInput, EMAIL_VALUE)
        await user.type(passwordInput, PASSWORD_VALUE)
        await user.type(confirmPasswordInput, CONFIRM_PASSWORD_VALUE)

        await user.click(submitButton)
      })
    })

    describe('Invalid form', () => {
      it('should show validation errors', async () => {
        const user = userEvent.setup()

        render(ExampleForm, config)

        const nameInput = screen.getByLabelText(NAME_LABEL)
        const emailInput = screen.getByLabelText(EMAIL_LABEL)
        const passwordInput = screen.getByLabelText(PASSWORD_LABEL)
        const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL)
        const submitButton = screen.getByRole('button', { name: /submit/i })

        await user.type(nameInput, 'Jo')
        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, 'pass')
        await user.type(confirmPasswordInput, 'different-pass')
        await user.click(submitButton)

        expect(await screen.findByText(NAME_MIN_ERROR)).toBeVisible()
        expect(await screen.findByText(EMAIL_FORMAT_ERROR)).toBeVisible()
        expect(await screen.findByText(PASSWORD_CONTAIN_NUMBER_ERROR)).toBeVisible()
        expect(await screen.findByText(CONFIRM_PASSWORD_ERROR)).toBeVisible()

        expect(screen.queryByText(SUBMITTED_SUCCESSFULLY_TEXT)).not.toBeInTheDocument()
      })
    })

    describe('External Errors', () => {
      it('should set multiple field errors from object', async () => {
        const user = userEvent.setup()
        const apiErrors = {
          name: ['Name is invalid'],
          email: ['Email is already taken']
        }

        render(ExampleForm, {
          global: config.global,
          props: {
            handleSubmit: (
              _values: Record<string, unknown>,
              { setErrors }: { setErrors: (...args: unknown[]) => void }
            ) => {
              setErrors(apiErrors)
            },
            initialValues: {
              name: NAME_VALUE,
              email: EMAIL_VALUE,
              password: PASSWORD_VALUE,
              confirmPassword: CONFIRM_PASSWORD_VALUE
            }
          }
        })

        const submitButton = screen.getByRole('button', { name: /submit/i })
        await user.click(submitButton)

        expect(await screen.findByText(apiErrors.name[0])).toBeVisible()
        expect(await screen.findByText(apiErrors.email[0])).toBeVisible()
      })
    })
  })

  describe('Form Reset', () => {
    it('should leave form with default values', async () => {
      const user = userEvent.setup()
      const otherName = 'other name'
      const otherEmail = 'other@example.com'

      render(ExampleForm, {
        global: config.global,
        props: {
          initialValues: {
            name: NAME_VALUE,
            email: EMAIL_VALUE,
            password: PASSWORD_VALUE,
            confirmPassword: CONFIRM_PASSWORD_VALUE
          }
        }
      })

      const nameInput = screen.getByLabelText(NAME_LABEL)
      const emailInput = screen.getByLabelText(EMAIL_LABEL)
      const resetButton = screen.getByRole('button', { name: /reset/i })

      await user.clear(nameInput)
      await user.clear(emailInput)
      await user.type(nameInput, otherName)
      await user.type(emailInput, otherEmail)

      expect(nameInput).toHaveValue(otherName)
      expect(emailInput).toHaveValue(otherEmail)

      await user.click(resetButton)

      expect(nameInput).toHaveValue(NAME_VALUE)
      expect(emailInput).toHaveValue(EMAIL_VALUE)
    })
  })

  describe('Nested Object Fields', () => {
    const FIRST_NAME_LABEL = 'First Name'
    const LAST_NAME_LABEL = 'Last Name'
    const EMAIL_LABEL = 'Email'
    const STREET_LABEL = 'Street Address'
    const CITY_LABEL = 'City'
    const POSTAL_CODE_LABEL = 'Postal Code'

    const FIRST_NAME_VALUE = 'John'
    const LAST_NAME_VALUE = 'Doe'
    const EMAIL_VALUE = 'john.doe@example.com'
    const STREET_VALUE = '123 Main Street'
    const CITY_VALUE = 'New York'
    const POSTAL_CODE_VALUE = '10001'

    it('should handle nested object field inputs correctly', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const firstNameInput = screen.getByLabelText(FIRST_NAME_LABEL)
      const lastNameInput = screen.getByLabelText(LAST_NAME_LABEL)
      const emailInput = screen.getByLabelText(EMAIL_LABEL)
      const streetInput = screen.getByLabelText(STREET_LABEL)
      const cityInput = screen.getByLabelText(CITY_LABEL)
      const postalCodeInput = screen.getByLabelText(POSTAL_CODE_LABEL)

      await user.type(firstNameInput, FIRST_NAME_VALUE)
      await user.type(lastNameInput, LAST_NAME_VALUE)
      await user.type(emailInput, EMAIL_VALUE)
      await user.type(streetInput, STREET_VALUE)
      await user.type(cityInput, CITY_VALUE)
      await user.type(postalCodeInput, POSTAL_CODE_VALUE)

      expect(firstNameInput).toHaveValue(FIRST_NAME_VALUE)
      expect(lastNameInput).toHaveValue(LAST_NAME_VALUE)
      expect(emailInput).toHaveValue(EMAIL_VALUE)
      expect(streetInput).toHaveValue(STREET_VALUE)
      expect(cityInput).toHaveValue(CITY_VALUE)
      expect(postalCodeInput).toHaveValue(POSTAL_CODE_VALUE)
    })

    it('should validate nested object fields correctly', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const firstNameInput = screen.getByLabelText(FIRST_NAME_LABEL)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(firstNameInput, 'J')
      await user.click(submitButton)

      expect(await screen.findByText('Must be at least 2')).toBeVisible()
    })

    it('should submit nested object form with correct data structure', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, {
        global: config.global,
        props: {
          handleSubmit: (values: Record<string, unknown>) => {
            expect(values).toEqual({
              user: {
                firstName: FIRST_NAME_VALUE,
                lastName: LAST_NAME_VALUE,
                email: EMAIL_VALUE
              },
              address: {
                street: STREET_VALUE,
                city: CITY_VALUE,
                postalCode: POSTAL_CODE_VALUE
              },
              skills: [{ name: 'JavaScript', level: 'advanced' }]
            })
          }
        }
      })

      const firstNameInput = screen.getByLabelText(FIRST_NAME_LABEL)
      const lastNameInput = screen.getByLabelText(LAST_NAME_LABEL)
      const emailInput = screen.getByLabelText(EMAIL_LABEL)
      const streetInput = screen.getByLabelText(STREET_LABEL)
      const cityInput = screen.getByLabelText(CITY_LABEL)
      const postalCodeInput = screen.getByLabelText(POSTAL_CODE_LABEL)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(firstNameInput, FIRST_NAME_VALUE)
      await user.type(lastNameInput, LAST_NAME_VALUE)
      await user.type(emailInput, EMAIL_VALUE)
      await user.type(streetInput, STREET_VALUE)
      await user.type(cityInput, CITY_VALUE)
      await user.type(postalCodeInput, POSTAL_CODE_VALUE)

      const skillNameInputs = screen.getAllByPlaceholderText('e.g., JavaScript')
      const levelSelects = screen.getAllByDisplayValue('Select level')

      await user.type(skillNameInputs[0], 'JavaScript')
      await user.selectOptions(levelSelects[0], 'advanced')

      await user.click(submitButton)
    })
  })

  describe('Dynamic Fields', () => {
    const SKILL_NAME_PLACEHOLDER = 'e.g., JavaScript'
    const ADD_SKILL_BUTTON = 'Add Skill'
    const REMOVE_SKILL_BUTTON = 'Remove Skill'

    it('should add new skill fields dynamically', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const initialSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(initialSkillInputs).toHaveLength(1)

      const addSkillButton = screen.getByRole('button', { name: ADD_SKILL_BUTTON })
      await user.click(addSkillButton)

      const updatedSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(updatedSkillInputs).toHaveLength(2)

      await user.click(addSkillButton)

      const finalSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(finalSkillInputs).toHaveLength(3)
    })

    it('should remove skill fields dynamically', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const addSkillButton = screen.getByRole('button', { name: ADD_SKILL_BUTTON })
      await user.click(addSkillButton)
      await user.click(addSkillButton)

      const skillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(skillInputs).toHaveLength(3)

      const removeButtons = screen.getAllByRole('button', { name: REMOVE_SKILL_BUTTON })
      expect(removeButtons).toHaveLength(3)

      await user.click(removeButtons[1])

      const updatedSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(updatedSkillInputs).toHaveLength(2)
    })

    it('should not remove the last skill field', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const initialSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(initialSkillInputs).toHaveLength(1)

      const removeButton = screen.getByRole('button', { name: REMOVE_SKILL_BUTTON })
      await user.click(removeButton)

      const finalSkillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      expect(finalSkillInputs).toHaveLength(1)
    })

    it('should validate dynamic fields correctly', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, config)

      const skillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(skillInputs[0], 'J')
      await user.click(submitButton)

      expect(await screen.findByText('Must be at least 2')).toBeVisible()
    })

    it('should submit dynamic fields with correct data structure', async () => {
      const user = userEvent.setup()

      render(ExampleFormWithNestedFields, {
        global: config.global,
        props: {
          handleSubmit: (values: Record<string, unknown>) => {
            expect(values).toEqual({
              skills: [
                { name: 'JavaScript', level: 'advanced' },
                { name: 'Vue.js', level: 'expert' }
              ]
            })
          },
          initialValues: {
            user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            address: { street: '123 Main St', city: 'NYC', postalCode: '10001' },
            skills: [{ name: '', level: '' }]
          }
        }
      })

      const addSkillButton = screen.getByRole('button', { name: ADD_SKILL_BUTTON })
      await user.click(addSkillButton)

      const skillInputs = screen.getAllByPlaceholderText(SKILL_NAME_PLACEHOLDER)
      const levelSelects = screen.getAllByDisplayValue('Select level')
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(skillInputs[0], 'JavaScript')
      await user.selectOptions(levelSelects[0], 'advanced')
      await user.type(skillInputs[1], 'Vue.js')
      await user.selectOptions(levelSelects[1], 'expert')

      await user.click(submitButton)
    })
  })

  describe('Slot Props', () => {
    it('should provide all expected slot props with correct initial structure', () => {
      render(ExampleForm, {
        global: config.global,
        slots: {
          default: (slotProps: Record<string, unknown>) => {
            expect(slotProps).toHaveProperty('isValid')
            expect(slotProps).toHaveProperty('error')
            expect(slotProps).toHaveProperty('errors')
            expect(slotProps).toHaveProperty('values')
            expect(slotProps).toHaveProperty('fields')
            expect(slotProps).toHaveProperty('reset')
            expect(slotProps).toHaveProperty('setErrors')
            expect(slotProps).toHaveProperty('validate')

            expect(slotProps.isValid).toBe(true)
            expect(slotProps.error).toBe(null)
            expect(slotProps.errors).toEqual([])
            expect(slotProps.values).toEqual(expect.any(Object))
            expect(slotProps.fields).toEqual(expect.any(Object))

            expect(slotProps.reset).toBeInstanceOf(Function)
            expect(slotProps.setErrors).toBeInstanceOf(Function)
            expect(slotProps.validate).toBeInstanceOf(Function)

            return null
          }
        }
      })
    })
  })
})
