export const translateScheduleKeys = (key: string): string => {
  const translations: { [key: string]: string } = {
    breakfast: 'Petit déjeuner',
    dinner: 'Dîner',
    spa: 'Spa',
    fitness_center: 'Centre de fitness',
    pool: 'Piscine',
    bar: 'Bar',
    restaurant: 'Restaurant',
    breakfast_buffet: 'Petit déjeuner buffet',
    cocktail: 'Cocktail',
    cocktail_alcoholic: 'Cocktail avec alcool',
    tea_time: 'Thé',
    brunch: 'Brunch',
    events: 'Événements',
  };

  return translations[key] || key;
}; 