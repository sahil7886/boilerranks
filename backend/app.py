from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["POST"])
def calculate_percentile():
    data = request.get_json()
    semester = data['semester']
    course = data['course']
    instructor = data['instructor']
    grade = data['grade']

    # Split the course into subject and code
    subject = ''.join(filter(str.isalpha, course))
    subject = subject.upper()
    code = ''.join(filter(str.isdigit, course))

    # Read the Excel file and the relevant sheet
    grades_df = pd.read_excel('./data/F2022-S2024_boilerranks.xlsx', sheet_name=semester)

    # Forward fill to handle merged cells
    grades_df.ffill(inplace=True)

    # Filter the DataFrame by subject and course number
    print("subject = "+subject)
    print("code = "+code)
    print("instructor = "+instructor)
    filtered_df = grades_df[(grades_df['Subject'] == subject) & 
                            (grades_df['Course Number'] == int(code)) &
                            (grades_df['Instructor'] == instructor)]

    if filtered_df.empty:
        return jsonify({'error': 'Course not found'}), 404

    # Fill NaN values with 0
    filtered_df.fillna(0, inplace=True)
    print(filtered_df.head)

    # Grade columns and their corresponding GPA values
    grade_columns = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
    gpa_values = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    }

    if grade not in grade_columns:
        print("Invalid grade: "+ grade)
        return jsonify({'error': 'Invalid grade'}), 400

    # Calculate the percentile ranges
    lower_bound = 100
    upper_bound = 100
    total_weight = 0
    weighted_gpa_sum = 0

    for g in grade_columns:
        if g == grade:
            upper_bound = lower_bound
            lower_bound -= (filtered_df[g].iloc[0] * 100)
            break
        lower_bound -= (filtered_df[g].iloc[0] * 100)

    for g in grade_columns:
        percentage = filtered_df[g].iloc[0] * 100
        weighted_gpa_sum += percentage * gpa_values[g]
        total_weight += percentage

    # Calculate average GPA
    avg_gpa = weighted_gpa_sum / total_weight if total_weight > 0 else 0
    avg_gpa = round(avg_gpa, 2)  # Round to 2 decimal places

    print(f"upper bound is {upper_bound} and lower bound is {lower_bound}")
    print(f"average GPA is {avg_gpa}")

    return jsonify({
        'upper_bound': upper_bound, 
        'lower_bound': lower_bound,
        'avg_gpa': avg_gpa
    })

@app.route('/professors', methods=["POST"])
def get_professors():
    data = request.get_json()
    semester = data['semester']
    course = data['course']

    # Split the course into subject and code
    subject = ''.join(filter(str.isalpha, course))
    subject = subject.upper()
    code = ''.join(filter(str.isdigit, course))

    # Read the Excel file and the relevant sheet
    grades_df = pd.read_excel('./data/F2022-S2024_boilerranks.xlsx', sheet_name=semester)

    # Forward fill to handle merged cells
    grades_df.ffill(inplace=True)

    # Filter the DataFrame by subject and course number
    filtered_df = grades_df[(grades_df['Subject'] == subject) & 
                            (grades_df['Course Number'] == int(code))]

    if filtered_df.empty:
        return jsonify({'error': 'Course not found'}), 404

    # Get unique professors for the filtered course
    professors = filtered_df['Instructor'].unique().tolist()

    return jsonify({'professors': professors})

if __name__ == '__main__':
    app.run(debug=True)
