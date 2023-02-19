# Bookmark Screenshots

This project takes screenshots of websites saved in a bookmarks.html file and stitches them together into a single image. It also offers a sorting function.

I wrote this so I could visualize all the pages I thought were important at one time. I have to confess, I'm a bookmark horder. As it would be very tedious for me to manually click through all my folders, I wrote these scripts instead! Enjoy if you so choose.

## Requirements

- Node.js (tested with v18.14.1 on Windows)
- Bookmarks exported from Firefox (may require tweaking for other platforms and browsers)

As of this writing, Firefox can import bookmarks from Microsoft browsers as well as Chrome, so if users have bookmarks from those browsers, they should export them from there first and import them into Firefox if they encounter any problems.

## Installation

To install the project, run:

    npm install


## Usage

To take screenshots of a bookmarks.html file, run:

    node bookmarkscreenshots.js


This script uses Puppeteer to capture the screenshots. The resulting images will be saved in the `./screenshots` directory.

To sort the bookmarks by domain and generate a new bookmarks.html file titled `sorted.html`, run:

    node sortbookmarks.js

The resulting file will be saved in the `./dist` directory.

To stitch the screenshots together into a single image, run:

    node stitch.js


The resulting image will be saved as `./dist/output.png`. Note that this image can be quite large (on the order of hundreds of megabytes) and may take a long time to open in programs like Photoshop.

An example `bookmarks.html` file is included in the repository. It's recommended to test with this file first, as it is small and may be faster to process than larger files.

## Contributing

Contributions are welcome via pull requests and issue reports. However, please note that the author does not have plans to actively support this project.

## License

This project is licensed under the MIT License.
