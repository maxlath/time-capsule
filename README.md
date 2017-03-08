# Time Capsule

A reboot of the awesome [Browse Periodically](https://addons.mozilla.org/en-US/firefox/addon/browse-periodically/) ([repo](https://github.com/masahal/BrowsePeriodically)):

> Browse sites you want to check periodically (every hour, day, week, month and so on). You can also use for reminding pages, for example, by browsing every month.

## Development Setup
```sh
git clone https://github.com/maxlath/time-capsule
cd time-capsule
```
* in Chrome
  * open [`chrome://extensions`](chrome://extensions)
  * tick the `developer mode` box
  * click `load non packaged extension` and open the project's `extension` folder where the `manifest.json` file is

* in Firefox: [instructions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox)
  * open [about:debugging](about:debugging)
  * Load Temporary Add-on and select the `./extension` folder

  Or just run `npm run firefox` to use a temporary profile thank to `web-ext`, but [encounters this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1338826)

## Todos
* publish on firefox and chrome addons marketplaces`

### Can wait
* make an article to explain all the thing, and maybe even a tuto video?
* settings board? what would be the needs for that?
  - customizing the default periodicity used to pre-select a periodicity when opening the menu
  - customizing if a given days bookmarks are opened grouped at some point of the day, instead of simply following the exact time it was set + period
* display a button to open the bookmark folder (with the mention "periodicity settings rely on bookmarks' titles, if you need to modify it, beware of not breaking the data after '//'")
