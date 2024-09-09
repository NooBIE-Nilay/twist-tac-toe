function generateGameId() {
  return Math.random().toString(36).substring(5, 11).toUpperCase();
}
function generateUniqueGameID(gameIdList: string[]) {
  let gameId;
  do {
    gameId = generateGameId();
  } while (gameIdList.includes(gameId));
  return gameId;
}

function generateRandomUsername() {
  const names = [
    "NooBIE",
    "Edith",
    "Avenger",
    "Killer",
    "Lucifer",
    "Asthetic",
    "Xzunheal",
    "Nightmare",
    "Stark",
    "Mik",
  ];
  return names[Math.floor(Math.random() * 10)] + Math.floor(Math.random() * 23);
}
export { generateRandomUsername, generateUniqueGameID };
