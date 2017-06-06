# Time Capsule
![banner](https://github.com/maxlath/time-capsule/raw/master/img/banners/time-capsule-on-dark-sky-with-title-and-subtitle.jpg)


An addon to send links to your future self.

The best person to send you links matching your interests is a time traveling version of yourself: **create a time capsule by choosing when the current tab should be re-opened**; this will bookmark the current tab, and program to re-open it in the future, according to the choosen periodicity, be it an hour, a day, a month, a year, a decade!

![popup-select](https://cloud.githubusercontent.com/assets/1596934/26828135/5223ec72-4ac0-11e7-9099-85bd92414565.gif)

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Context](#context)
- [Development Setup](#development-setup)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/time-capsule/)
* [Chrome](https://chrome.google.com/webstore/detail/time-capsule/mmpajmbpehdbemfblpmkfmmdampljkdi)

If you use a different browser that implements WebExtension, that shouldn't be hard to make it work for you too: make a request in the [issues](http://github.com/maxlath/time-capsule/issues) or on [twitter](https://twitter.com/maxlath) to let me know, and I will see if that's possible.

## Context

This is a reboot of the awesome, but out-dated, [Browse Periodically](https://addons.mozilla.org/en-US/firefox/addon/browse-periodically/) ([repo](https://github.com/masahal/BrowsePeriodically)):

> Browse sites you want to check periodically (every hour, day, week, month and so on). You can also use for reminding pages, for example, by browsing every month.

I started working on it before Firefox was up to speed with WebExtension so had to let it sleep for a moment. Meanwhile, a team started working on [SnoozeTabs](https://github.com/bwinton/SnoozeTabs), it's pretty much the same but you loose all the time-traveling jokes.

## Development Setup
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

  Or just run `npm run firefox` to use a temporary profile, with the advantage of automatically reloading the extension on change, thank to `web-ext`, but [encounters this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1338826)

## License
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
