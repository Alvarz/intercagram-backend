'use strict'
const path = require('path')
const to = require('../helper/to')

/*
 * @class file upload wrapper
 * */
module.exports = class fileUploadWrapper {
  /*
   * class constructor
   */
  constructor () {
    this.allowed = ['image/png', 'image/jpeg', 'image/jpg']
    this.appdir = path.dirname(require.main.filename)
  }

  /*
   * multiupload the files
   * @param {object} request object
   * @return {promise}
   */
  async upload (req) {
    let uploadedFiles = []
    let self = this
    return new Promise(async (resolve, reject) => {
      if (Object.keys(req.files).length < 1) {
        reject('there is no files to upload')
      }
      /** itearate over all files */
      for (let key in req.files) {
      /** The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file */
        let sampleFile = req.files[key]
        if (!this.isAllowerd(sampleFile.mimetype)) {
          reject('not allowerd format')
        }

        /** upload the single file */
        let [err, resp ] = await to(this.uploadFile(sampleFile))
        if (err) { reject(err) }
        /** add the url to the array */
        uploadedFiles.push(`${resp}`)
      }
      /** all was good, carry on! */
      resolve(uploadedFiles)
    })
  }

  /*
   * validate if is a accepted mimetype
   * @param {string} type
   * @return {boolean}
   */
  isAllowerd (type) {
    return (this.allowed.indexOf(type) > -1)
  }

  /*
   * multiupload the single file
   * @param {object} sampleFile
   * @return {promise}
   */
  async uploadFile (sampleFile) {
    return new Promise((resolve, reject) => {
      /** to the path */
      let name = `${this.guid()}-${sampleFile.name}`
      let pathName = `${this.appdir}/storage/image-${name}`
      let savename = `/photos/image-${name}`
      try {
        /** move the file to it's final storage */
        sampleFile.mv(pathName, (err) => {
          if (err) { reject(err) }
          resolve(savename)
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }

  /*
   * generate the guid
   * @return {string}
   */
  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }
}
