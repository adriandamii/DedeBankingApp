export const loginTokenAdmin = (): string => {
   const length = 6;
   const characters = 'abcdefghijklmnopqrstuvwxyz';
   let code = '';
   for (let i = 0; i < length; i++) {
       code += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return code;
}