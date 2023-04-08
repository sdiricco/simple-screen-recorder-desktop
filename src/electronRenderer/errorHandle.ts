export class ElectronError extends Error {
  name: string;
  details: string;
  type: string;
  code: number;

  constructor({ message = '', details = "", type = "", code = 0 } = {}) {
    super(message);
    this.name = "ElectronError";
    this.details = details;
    this.type = type;
    this.code = code;
  }
}
