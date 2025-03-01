export const translateTransportationKeys = (key: string) => {
  const translations: { [key: string]: string } = {
    nearest_airports: 'Aéroports les plus proches',
    parking: 'Parking gratuit sur place',
    metro: 'Métro',
    distance_from_center: 'Distance du centre',
    car: 'Voiture',
    taxi: 'Taxi',
    shuttle: 'Shuttle',
    bus: 'Bus',
    train: 'Train',
    boat: 'Bateau',
    bike: 'Vélo',
  };
  return translations[key] || key;
};
