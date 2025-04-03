import { z } from 'zod'

// Define the Zod schema for CommonContactDto
export const ModifyContactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }), // Equivalent to @IsString() and @IsNotEmpty()
  position: z.string().min(1, { message: 'Position is required.' }), // Equivalent to @IsString() and @IsNotEmpty()
  email: z.string().email({ message: 'Invalid email format.' }), // Equivalent to @IsString(), @IsNotEmpty(), and @IsEmail()
  phone: z
    .string()
    .optional() // Equivalent to @IsOptional()
    .refine(
      (value) =>
        value === undefined || (value.length === 10 && /^[0-9]+$/.test(value)),
      { message: 'Phone must be exactly 10 digits.' }
    ), // Equivalent to @MinLength(10), @MaxLength(10), and custom validation
  linkedInUrl: z.string().optional(), // Equivalent to @IsOptional() and @IsString()
  location: z.string().optional(), // Equivalent to @IsOptional() and @IsString()
})

export type ModifyContact = z.infer<typeof ModifyContactSchema>
