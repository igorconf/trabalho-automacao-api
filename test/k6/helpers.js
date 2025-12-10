export function randomUsername(prefix = 'user') {
  const id = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${id}`;
}

export function randomPassword() {
  return Math.random().toString(36).substring(2, 10);
}

export function fakerName() {
  const names = ['igor','maria','joao','rayla','ana','carlos'];
  return names[Math.floor(Math.random() * names.length)];
}
