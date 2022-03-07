import React from 'react'

import {
  Col
} from 'reactstrap'

import ModalsFeedback from './ModalsFeedback'

// Mentor's feedback from his/her mentees
const feedback = [
  {
      id: 1,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus feugiat tortor nec elit molestie accumsan. Donec interdum ante ut ex sagittis, at porttitor augue molestie. Integer eget pulvinar arcu. Vestibulum sit amet sagittis orci. Nulla aliquet risus ex, sit amet sollicitudin erat pellentesque et. Suspendisse vitae sem nec eros cursus congue ac in odio. Praesent dapibus quis magna eget placerat. Ut quis ipsum a massa auctor tincidunt id a dolor. Quisque dignissim magna a ornare lacinia. Nunc elementum, nulla vel tristique tincidunt, purus orci laoreet ipsum, sed facilisis nulla nibh eu massa. Ut sed diam euismod, gravida massa ut, bibendum dolor. Quisque id lorem cursus, pellentesque ligula eu, faucibus erat.'
  },
  {
      id: 2,
      text: 'Phasellus condimentum sapien lectus, sed commodo tellus gravida ac. Proin pellentesque pulvinar massa, ac gravida orci eleifend tempus. Morbi maximus lorem eu elementum pellentesque. In quis elit ac nisl ultrices ultrices in eu lorem. Fusce quis tempor elit. Ut non sapien quis dolor fringilla tempor id ut enim'
  }
]

const Feedback = ()  => {
  return (
    <>
    {feedback.map( (fb) => (
                    <Col>
                        <ModalsFeedback {...fb} title="Feedback Description" key={fb.id} info={fb.text} />
                        <br></br>
                    </Col>
        ))}
    </>

  )
}

export default Feedback;