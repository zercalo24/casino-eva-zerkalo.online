// ============================================
// КОНФИГ EVA CASINO — меняй только здесь!
// ============================================
// Чтобы сменить реф-ссылку:
// 1. Открой этот файл
// 2. Измени значение CASINO_URL ниже
// 3. Сохрани файл
// 4. Залей на GitHub
// Всё! Ссылка обновится на всех страницах автоматически.
// ============================================

const EVA_CONFIG = {
  // ГЛАВНАЯ РЕФ-ССЫЛКА — меняй здесь при бане
  CASINO_URL: "https://string-26eva.com/dxntblcsp",

  // Текст кнопок (менять не обязательно)
  BTN_BONUS: "🎁 Получить 900 ФС",
  BTN_PLAY:  "🎰 Играть",
  BTN_REG:   "🎰 Зарегистрироваться с бонусом",
  BTN_MIRROR:"🔗 Перейти на зеркало EVA Casino",
};

// Автозамена всех ссылок на странице
document.addEventListener("DOMContentLoaded", function() {
  // Находим все ссылки которые ведут на казино
  const links = document.querySelectorAll('a[href*="gameshowrt"], a[href*="casino_url_placeholder"]');
  links.forEach(function(link) {
    link.href = EVA_CONFIG.CASINO_URL;
  });

  // Также обновляем data-атрибуты если есть
  const dataLinks = document.querySelectorAll('[data-casino-url]');
  dataLinks.forEach(function(el) {
    el.href = EVA_CONFIG.CASINO_URL;
  });
});
