import { DataTypes, Model } from "sequelize";
import util from "util";
import connectToDB from "./db.js";

export const db = await connectToDB("postgresql:///lineupv001");

// admin model
export class Admin extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// instructor model
export class Instructor extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// studennt model
export class Student extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// resort model
export class Resort extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// lesson model
export class Lesson extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// time entry model
export class TimeEntry extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// review model
export class Review extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

//
Student.init(
  {
    studentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "students",
    sequelize: db,
  }
);

Instructor.init(
  {
    instructorId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    certification: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    socials: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    venmo: {
      type: DataTypes.STRING,
    },
    cashapp: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.TEXT,
    },
    isClockedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: "instructor",
    sequelize: db,
  }
);

Resort.init(
  {
    resortId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "resorts",
    sequelize: db,
  }
);

Review.init(
  {
    reviewId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reviewMessage: {
      type: DataTypes.TEXT,
    },
    stars: {
      type: DataTypes.INTEGER,
    },
  },
  {
    modelName: "reviews",
    sequelize: db,
  }
);

Lesson.init(
  {
    lessonId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lessonType: {
      type: DataTypes.STRING,
    },
    roster: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "lessons",
    sequelize: db,
  }
);

TimeEntry.init(
  {
    timeEntryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clockInTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clockOutTime: {
      type: DataTypes.DATE,
    },
    comments: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "timeEntry",
    sequelize: db,
  }
);

Admin.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    modelName: "admins",
    sequelize: db,
  }
);

// associations

Instructor.hasMany(Review, { foreignKey: "instructorId" });
// resort belongs to user
Student.hasMany(Review, { foreignKey: "studentId" });
// review belongs to innstructor
Review.belongsTo(Instructor, { foreignKey: "instructorId" });
// lesson belongs to instructor
Lesson.belongsTo(Instructor, { foreignKey: "instructorId" });
// instructor has many lessons
Instructor.hasMany(Lesson, { foreignKey: "lessonId" });
// messaging associations
