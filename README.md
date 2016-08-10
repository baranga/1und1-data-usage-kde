# 1und1 Data Usage KDE Plasma Widget
Clone the repository and run plasma package manager to install:
```bash
$ git clone https://github.com/baranga/1und1-data-usage-kde.git
$ cd 1und1-data-usage-kde
$ plasmapkg2 -i plasmoid
```

Pull and rerun plasma package manager to update:
```bash
$ cd 1und1-data-usage-kde
$ git pull
$ plasmapkg2 -u plasmoid
```

Install/update and then run `plasmoidviewer` or `plasmawindowed` to test:
```bash
$ plasmoidviewer -a de.baranga.1und1-data-usage
$ plasmawindowed de.baranga.1und1-data-usage
```
