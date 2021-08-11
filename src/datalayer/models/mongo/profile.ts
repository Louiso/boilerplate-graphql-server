import mongoose, { Schema } from 'mongoose'

const socialNetworkSchema = new Schema({
  socialNetwork: { type: String },
  url          : { trim: true, type: String }
})

const experienceSchema = new Schema({
  area               : { trim: true, type: String },
  companyName        : { trim: true, type: String },
  description        : { trim: true, type: String },
  endDate            : { type: Date },
  hierarchy          : { trim: true, type: String },
  idExperienceLaborum: { trim: true, type: String },
  imgUrl             : { type: String },
  jobPosition        : { trim: true, type: String },
  location           : { trim: true, type: String },
  startDate          : { type: Date },
  workHere           : { 'default': false, type: Boolean }
})

const educationSchema = new Schema({
  academicArea      : { trim: true, type: String },
  career            : { trim: true, type: String },
  condition         : { type: String },
  degree            : { type: String },
  description       : { trim: true, type: String },
  endDate           : { type: Date },
  idEducationLaborum: { type: String },
  imgUrl            : { type: String },
  institutionName   : { trim: true, type: String },
  startDate         : { type: Date },
  studyingHere      : { 'default': false, type: Boolean }
})

const especializationSchema = new Schema({
  description         : { trim: true, type: String },
  endDate             : { type: Date },
  especializationName : { trim: true, type: String },
  especializationPlace: { trim: true, type: String },
  especializationtype : { type: String },
  imgUrl              : { type: String },
  startDate           : { type: Date },
  studyingHere        : { 'default': false, type: Boolean }
})

const knowledgeSchema = new Schema({
  knowledgeName: { trim: true, type: String },
  level        : { type: String }
})

const fileSchema = new Schema({
  fileName        : { type: String },
  filenameOriginal: { type: String },
  url             : { type: String }
}, { timestamps: true })

const emailsPhonesSchema = new Schema({
  type : { type: String },
  value: { trim: true, type: String }
})

const salarySchema = new Schema({
  amount  : { trim: true, type: String },
  currency: { type: String }
})

const profileSchema = new Schema({
  birthDate        : { type: Date },
  civilState       : { type: String },
  curriculum       : fileSchema,
  cv_id            : { type: String },
  deleted          : { 'default': false, type: Boolean },
  docNumber        : { trim: true, type: Number },
  education        : [ educationSchema ],
  emails           : [ emailsPhonesSchema ],
  especialization  : [ especializationSchema ],
  experience       : [ experienceSchema ],
  firstJob         : { 'default': false, type: Boolean },
  firstName        : { trim: true, type: String },
  idUser           : { type: String },
  knowledge        : [ knowledgeSchema ],
  lastName         : { trim: true, type: String },
  location         : { type: String },
  nationality      : { trim: true, type: String },
  phones           : [ emailsPhonesSchema ],
  photo            : { type: String },
  salaryExpectation: salarySchema,
  sex              : { type: String },
  socialNetworks   : [ socialNetworkSchema ],
  status           : {
    'default': 'none',
    'enum'   : [ 'none', 'scraping', 'loadingCV' ],
    type     : String
  },
  textInfo: {
    'default': true,
    type     : Boolean
  },
  userIdLaborum: { type: String },
  websites     : [ emailsPhonesSchema ]
}, { timestamps: true })

profileSchema.index({
  'emails.value': 'text',
  firstName     : 'text',
  lastName      : 'text',
  location      : 'text',
  'phones.value': 'text'
})

const Profile = mongoose.model('Profile', profileSchema)

export default Profile
