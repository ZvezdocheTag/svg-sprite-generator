## Работа с svg спрайтами

### Сборка

Иконки svg складываем в папку `/icons`
После генерирования в папке `/sprite`, будут 3 файла:

1. sprite.svg 
2. metadata.html - визуализация svg спрайта
3. metadata.json - данные спрайта id иконок и viewBox

Для первого запуска генератора спрайтов, требуется добавить npm пакеты 

Выполняем:

	npm i

Команда для сборки спрайтов:

	gulp svgsprite

Расположения путей для сборки будут уточняться скорее всего это config.json,
пока файловая система инлайновая напрямую в сборщике, во время интеграции в 
основной проект будет переписана.

Название иконки генерируется от названия родного файла иконки и к нему
 добавляется префикс `svg-icon-*`, пример:

**file:**   `star.svg`

**id иконки:**   ` #svg-icon-star`

### Использование

Инлайновая вставка в html:

```html
    <svg class="svg-icon">
        <use xlink:href="/path/to/sprite.svg#svg-icon-ok-finger"></use>
    <svg>
```
Стилизация происходит через класс заданный в теге `<svg>`.
В теге `<use>` указываем путь к спрайту и id нужной нам иконки.


#### ISSUE

Доработать использование через css background


### Using resources

 https://www.npmjs.com/package/gulp-util <br>
 https://github.com/cheeriojs/cheerio  <br>
 https://github.com/gulpjs/vinyl <br>

 * Генерировать html и контент
   http://stackoverflow.com/questions/21617468/node-js-generate-html