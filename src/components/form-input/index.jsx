const INPUT_CLASS = `px-5 py-3 border border-black/10 rounded-[10px] text-sm bg-white/60 backdrop-blur 
  focus:outline-none focus:border-[#FF6D00] focus:shadow-[0_0_0_3px_rgba(255,109,0,0.12)] transition-all w-full`;

/**
 * Input de formulário padronizado.
 *
 * @param {object} props - Todas as props nativas de <input>.
 */
export function FormInput(props) {
  return <input className={`FormInputComponent ${INPUT_CLASS}`} {...props} />;
}

/**
 * Textarea de formulário padronizado.
 *
 * @param {object} props - Todas as props nativas de <textarea>.
 */
export function FormTextarea(props) {
  return <textarea className={`FormTextareaComponent ${INPUT_CLASS} min-h-[120px] resize-y`} {...props} />;
}
