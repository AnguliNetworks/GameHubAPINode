export default (date = new Date()) => date.toISOString().slice(0, 19).replace('T', ' ');
