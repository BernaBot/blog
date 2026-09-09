export const EVENTO_ACCESO = "apatia-acceso";

export function pedirAcceso() {
  window.dispatchEvent(new Event(EVENTO_ACCESO));
}
