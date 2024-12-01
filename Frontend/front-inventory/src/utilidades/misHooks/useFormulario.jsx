import { useState } from "react";

export const useFormulario = (objetoInicial) => {
  const [objeto, setObjeto] = useState(objetoInicial);

  const dobleEnlace = (event) => {
    const { name, value } = event.target;
    setObjeto({ ...objeto, [name]: value });
  };

  return {
    objeto,
    dobleEnlace,
    ...objeto,
  };
};