'use server';
/**
 * @fileOverview This file implements a Genkit flow for automatically suggesting a category for new tickets.
 *
 * - adminTicketCategorization - A function to categorize a ticket based on its description.
 * - AdminTicketCategorizationInput - The input type for the adminTicketCategorization function.
 * - AdminTicketCategorizationOutput - The return type for the adminTicketCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminTicketCategorizationInputSchema = z.object({
  description: z.string().describe('The description of the ticket to categorize.'),
});
export type AdminTicketCategorizationInput = z.infer<typeof AdminTicketCategorizationInputSchema>;

const AdminTicketCategorizationOutputSchema = z.object({
  category: z
    .enum(['IT Support', 'Admissions', 'Billing', 'General Inquiry', 'Other'])
    .describe('The suggested category for the ticket.'),
});
export type AdminTicketCategorizationOutput = z.infer<typeof AdminTicketCategorizationOutputSchema>;

export async function adminTicketCategorization(
  input: AdminTicketCategorizationInput
): Promise<AdminTicketCategorizationOutput> {
  return adminTicketCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminTicketCategorizationPrompt',
  input: {schema: AdminTicketCategorizationInputSchema},
  output: {schema: AdminTicketCategorizationOutputSchema},
  prompt: `You are an AI assistant that categorizes college helpdesk tickets.

Categorize the following ticket description into one of these categories: 'IT Support', 'Admissions', 'Billing', 'General Inquiry', or 'Other'.

Ticket Description: {{{description}}}`,
});

const adminTicketCategorizationFlow = ai.defineFlow(
  {
    name: 'adminTicketCategorizationFlow',
    inputSchema: AdminTicketCategorizationInputSchema,
    outputSchema: AdminTicketCategorizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to categorize ticket. No output from prompt.');
    }
    return output;
  }
);
