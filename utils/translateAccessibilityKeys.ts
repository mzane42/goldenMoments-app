export const translateAccessibilityKeys = (key: string) => {
  const translations: { [key: string]: string } = {
    elevator: 'Ascenseur',
    wheelchair_accessible: 'Accessible aux fauteuils roulants',
    accessible_rooms: 'Chambres accessibles',
    accessible_bathroom: 'Salle de bain accessible',
    accessible_lobby: 'Reception accessible',
    accessible_restaurant: 'Restaurant accessible',
    accessible_bar: 'Bar accessible',
    accessible_pool: 'Piscine accessible',
    accessible_fitness_center: 'Centre de fitness accessible',
    accessible_spa: 'Spa accessible',
  };
  return translations[key] || key;
};