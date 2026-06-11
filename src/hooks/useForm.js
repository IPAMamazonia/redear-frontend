import { useState } from 'react';

/**
 * Hook para gerenciar estado de formulários com mudança e reset.
 *
 * @param {object} [initialValues={}] - Valores iniciais do formulário.
 * @returns {{ values, handleChange, reset, setValues }}
 */
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset, setValues };
}
