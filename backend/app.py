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
    #print(grades_df.head)

    # Filter the DataFrame by subject and course number
    print("subject = "+subject)
    print("code = "+code)
    print("instructor = "+instructor)
    filtered_df = grades_df[(grades_df['Subject'] == subject) & 
                            (grades_df['Course Number'] == int(code)) &
                            (grades_df['Instructor'] == instructor)]

    if filtered_df.empty:
        return jsonify({'error': 'Course not found'}), 404

    print(filtered_df.head)

    # Calculate the percentile range for the given grade
    grade_columns = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E', 'F', 'AU', 'I', 'N', 'NS', 'P', 'PI', 'S', 'SI', 'U', 'W']
    if grade not in grade_columns:
        print("Invalid grade: "+ grade)
        return jsonify({'error': 'Invalid grade'}), 400

    # Calculate the percentile ranges
    total_students = 100  # Assuming the percentages add up to 100%
    lower_bound = 100
    upper_bound = 100
    for g in grade_columns:
        if g == grade:
            upper_bound = lower_bound
            lower_bound -= (filtered_df[g].iloc[0] * 100)
            break
        lower_bound -= (filtered_df[g].iloc[0] * 100)
    print("upper bound is "+ str(upper_bound) + " and lower bound is " + str(lower_bound))
    return jsonify({
        'upper_bound': upper_bound, 
        'lower_bound': lower_bound
        })

if __name__ == '__main__':
    app.run(debug=True)
