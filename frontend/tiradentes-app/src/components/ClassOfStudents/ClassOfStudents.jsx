import React, { useEffect } from 'react'

const ClassOfStudents = ({selectedSchool}) => {

  return (
    <div className='text-slate-500 w-full text-center'>{!selectedSchool ? 'Nenhuma escola selecionada' : 'EEEEEEEoooooo'}</div>
  )
}

export default ClassOfStudents