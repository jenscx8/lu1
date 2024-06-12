

// create new lesson
app.post('/api/new-lessonn', async (req, res) => {
    const instructorId = req.session.instructorId
  
    const instructor = await Instructor.findByPk(instructorId)
    const location = instructor.location
    const roster = []
  
    const {
      lessonType,
      date,
    } = req.body;
  
    const newLesson = await Lesson.create({
      instructorId,
      lessonType,
      date,
      roster,
      location,
    })
    res.json(newLesson)
  })

  // student add to lesson
app.post('/api/lessons/:lessonId/add-student', async (req, res) => {
    const { lessonId } = req.params;
    const { studentId } = req.session
  
    
    const lesson = await Lesson.findByPk(lessonId)
    const student = await Student.findByPk(studentId)
  
    const { firstName, lastName, email } = student;
  
  
    lesson.roster.push({studentId, firstName, lastName, email})
  
    Lesson.update({ roster: lesson.roster }, {where: {lessonId: lessonId}});
  
    await lesson.save()
  
     // Emit event to update lesson roster
     io.emit('updateLesson', lesson);
  
    res.json(lesson)
  })

// remove student from lesson
app.post('/api/lessons/:lessonId/remove-student', async (req, res) => {
    const { lessonId } = req.params;
    const { studentId } = req.body;
  
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
  
      lesson.roster = lesson.roster.filter(student => student.studentId !== studentId);
      await lesson.save();
  
      // Emit event to update lesson roster
      io.emit('updateLesson', lesson);
  
      res.json({ message: 'Student removed from lesson roster', roster: lesson.roster });
    } catch (error) {
      console.error('Error removing student from lesson:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });