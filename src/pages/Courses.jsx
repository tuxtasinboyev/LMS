import React from 'react'
import Header from '../components/Headers'
import Fotter from '../components/Fotter'
import { CoursesSection, CoursesSections } from '../utils/helper'

function Courses() {
  return (
    <div>
      <Header />
      <CoursesSections />
      <br />
      <Fotter />
    </div>
  )
}

export default Courses