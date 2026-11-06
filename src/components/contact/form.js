export const CONTACT_FORM_INITIAL = {
  nome: '',
  email: '',
  assunto: '',
  msg: '',
};

/**
 * Valida os campos obrigatórios do formulário de contato.
 *
 * @param {{ nome: string, email: string, msg: string }} form - Valores atuais.
 * @returns {{ type: 'error', key: string }|null} Erro com chave i18n, ou `null` se válido.
 */
export function validateContactForm({ nome, email, msg }) {
  if (!nome.trim() || !email.trim() || !msg.trim()) {
    return { type: 'error', key: 'contact.status.missingFields' };
  }

  if (!email.includes('@') || !email.includes('.')) {
    return { type: 'error', key: 'contact.status.invalidEmail' };
  }

  return null;
}
