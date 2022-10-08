# generate-tickets

This is the part of the project that deals with actually generating the ticket
files ready to be printed and adding the codes to the database so they
can be validated at a later time.

### Setup
- Copy & rename the `.env.demo` to `.env` file and add the right data
- Check the [`options.json`](options.json) file and make any needed chnages (i.e.:
the template file, barcode positions, etc...)

### Running
- `node generate.js`

### Output
- Can be found in the `out` directory

# Licenses
- Project License: See root README
- OSS Licenses: [OSS_Licenses.txt](OSS_Licenses.txt)
