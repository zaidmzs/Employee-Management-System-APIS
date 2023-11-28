const express = require('express');
const moment = require('moment'); // For date manipulations
const app = express();
const PORT = process.env.PORT || 3000;

const employees = [
    {
      id: 1,
      name: 'John',
      jobTitle: 'Data Scientist',
      salary: 100000,
      startDate: '2022-01-15'
    },
    {
      id: 2,
      name: 'Jane',
      jobTitle: 'Project Manager',
      salary: 110000,
      startDate: '2021-05-20'
    },
    {
      id: 3,
      name: 'Bob',
      jobTitle: 'Frontend Developer',
      salary: 95000,
      startDate: '2020-03-10'
    },
    {
      id: 4,
      name: 'Johnson',
      jobTitle: 'Backend Developer',
      salary: 105000,
      startDate: '2020-12-05'
    },
    {
      id: 5,
      name: 'Alice',
      jobTitle: 'Frontend Developer',
      salary: 85000,
      startDate: '2019-08-22'
    },
    {
      id: 6,
      name: 'Williams',
      jobTitle: 'Data Scientist',
      salary: 120000,
      startDate: '2018-06-15'
    },
    {
      id: 7,
      name: 'Charlie',
      jobTitle: 'Project Manager',
      salary: 90000,
      startDate: '2021-02-10'
    },
    {
      id: 8,
      name: 'Brown',
      jobTitle: 'Backend Developer',
      salary: 95000,
      startDate: '2022-09-30'
    },
    {
      id: 9,
      name: 'Eva',
      jobTitle: 'Frontend Developer',
      salary: 95000,
      startDate: '2019-12-15'
    },
    {
      id: 10,
      name: 'Martinez',
      jobTitle: 'Data Scientist',
      salary: 88000,
      startDate: '2020-08-05'
    }
  ];



// Calculate Average Salary
app.get('/average-salary-by-position', (req, res) => {
    const positions = {};

    employees.forEach(employee => {
        const position = employee.position;
        if (!positions[position]) {
            positions[position] = {
                totalSalary: 0,
                count: 0
            };
        }
        positions[position].totalSalary += employee.salary;
        positions[position].count++;
    });

    const averageSalaries = {};
    for (const position in positions) {
        const avgSalary = positions[position].totalSalary / positions[position].count;
        averageSalaries[position] = avgSalary;
    }

    res.json(averageSalaries);
});


// Filter Employees by Experience Level
function calculateExperience(joiningDate) {
    const today = moment();
    const joined = moment(joiningDate);
    return today.diff(joined, 'years');
}


app.get('/employees-by-experience/:minExp/:maxExp', (req, res) => {
    const minExperience = parseInt(req.params.minExp);
    const maxExperience = parseInt(req.params.maxExp);

    const filteredEmployees = employees.filter(employee => {
        const experience = calculateExperience(employee.startDate);
        return experience >= minExperience && experience <= maxExperience;
    });

    res.json(filteredEmployees);
});

//top earner
app.get('/top-earners', (req, res) => {
    const { n } = req.query;

    if (!n || isNaN(n)) {
        return res.status(400).json({ error: 'Please provide a valid value for "n".' });
    }

    const topEarners = employees
        .sort((a, b) => b.salary - a.salary)
        .slice(0, parseInt(n));

    res.json(topEarners);
});

//employee retention
app.get('/employee-retention-rate', (req, res) => {
    const { startYear, endYear } = req.query;

    if (!startYear || !endYear || isNaN(startYear) || isNaN(endYear)) {
        return res.status(400).json({ error: 'Please provide valid startYear and endYear parameters.' });
    }

    const startEmployees = employees.filter(employee => {
        return new Date(employee.joiningDate).getFullYear() <= parseInt(startYear);
    });

    const endEmployees = employees.filter(employee => {
        return new Date(employee.joiningDate).getFullYear() <= parseInt(endYear);
    });

    const retentionRates = {};

    for (const position in startEmployees) {
        const startCount = startEmployees[position].length;
        const endCount = endEmployees[position].length;

        const retentionRate = ((endCount - (startCount - endCount)) / startCount) * 100;
        retentionRates[position] = retentionRate;
    }

    res.json(retentionRates);
});

//salary range
app.get('/employees-by-salary-range', (req, res) => {
    const { minSalary, maxSalary } = req.query;
    const filteredEmployees = employees.filter(employee => {
        return employee.salary >= parseInt(minSalary) && employee.salary <= parseInt(maxSalary);
    });

    res.json(filteredEmployees);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
