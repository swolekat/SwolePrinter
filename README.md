**Please check out [the video tutorial](https://www.youtube.com/watch?v=QFVlfMZZj7g) if you prefer that**

# Do NOT use the lb2 file directly. The line endings are off. Instead use the lb2 file from the [ko-fi page](https://ko-fi.com/s/84f433f042)

# SwolePrinter
Lioranboard 2 extension for printing things

## Requirements
You must have node.js installed and npm installed for this to work. 

Please make sure your printer can print a pdf otherwise this won't work.

## How to install
Just install the lb2 file like you normally would.

## How to use
There are two extension commands you can use:
* `SwolePrint` - uses a template
  * `Replacement Map` - JSON map. The key is the string that will be replaced. The value is what is replaced with. 
  * `Printer Name` - name of the printer
  * `Text to Remove` - Any text to remove from the values of the replacement map.
  * `Template Name` - name of the template html file. This will be located in your lioranboard folder under `swoleprinter`
  * `Show Images` - Process the values of the replacement map to convert links into images.
* `SwolePrintRaw` - use this if you want to write html directly to the printer.
  * `Html` - the raw html you want to send the printer
  * `Printer Name` - name of the printer

### Making Templates
Inside of your lioranboard folder, there will be a `swoleprinter` folder. Here if you write html files, you can access them in the `Template Name` field. You can pass data by using things in the `Replacement Map` field.

You should customize the existing templates to work with your printer. 

**PLEASE NOTE**

The browser that is used does NOT support modern javascript/css. Looks to be around ES5. Flexbox and grid do not work in css.
