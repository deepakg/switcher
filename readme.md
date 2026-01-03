# Switcher

A Chrome extension to quickly switch between different websites.

Web development usually involves working across your local machine, a staging host and a production host. This extension allows you to switch between the three quickly using a single-letter keyboard shortcut.

## Installation

1. Clone or download this repository to directory on your machine.
2. In Chrome's address bar, type: chrome://extensions
3. Click the 'Developer mode' toggle in the top right corner
4. Click the 'Load unpacked' button and point the file open dialog to the folder where you downloaded/cloned Switcher.

By default Chrome groups all the extensions under the Extensions menu (the jigsaw puzzle piece icon next to the address bar). Click it and locate this extension - it appears as 'Site Switcher'. Click on the Pin icon next to it so that appears in your toolbar.

## Usage

Right-click on the Site Switcher icon and select Options. This will open the page that'll allow you to configure the sites you want to switch between. For any web development work, be sure to check the Pass Querystring checkbox.

Let's say you added two sites with Pass Querystring checked:

s - https://staging
p - https://proudction

When you visit https://staging and press p the extension will take you to https://production including any querystring parameters. And if you are on production, pressing s will take you back to https://staging

You can organize collections of related urls into their own group. This is useful if you work across different projects across different hosts. This way you can reuse the same keys to cycle between staging and production.
