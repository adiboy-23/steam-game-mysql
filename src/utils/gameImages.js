// Dynamic import of all game images
function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    const gameId = item.replace('./', '').replace(/\.(png|jpe?g|svg)$/, '');
    images[gameId] = r(item);
  });
  return images;
}

// Import all images from the assets directory
const gameImages = importAll(require.context('../assets', false, /\.(png|jpe?g|svg)$/));

export default gameImages;
