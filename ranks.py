import tkinter as tk
from tkinter import ttk, messagebox
import random  # For demo purposes, replace with actual data processing

class BoilerRanks:
    def __init__(self, master):
        self.master = master
        master.title("BoilerRanks")
        master.geometry("600x400")

        self.mode = tk.StringVar(value="single")
        self.courses = []

        self.create_widgets()

    def create_widgets(self):
        # Mode selection
        ttk.Label(self.master, text="Select Mode:").grid(row=0, column=0, padx=10, pady=10)
        ttk.Radiobutton(self.master, text="Single", variable=self.mode, value="single", command=self.toggle_mode).grid(row=0, column=1)
        ttk.Radiobutton(self.master, text="Overall", variable=self.mode, value="overall", command=self.toggle_mode).grid(row=0, column=2)

        # Input fields
        self.course_code = ttk.Entry(self.master)
        self.grade = ttk.Combobox(self.master, values=["A", "B", "C", "D", "F"])
        self.semester = ttk.Entry(self.master)
        self.professor = ttk.Entry(self.master)

        labels = ["Course Code:", "Grade:", "Semester:", "Professor:"]
        for i, label in enumerate(labels):
            ttk.Label(self.master, text=label).grid(row=i+1, column=0, padx=10, pady=5)

        self.course_code.grid(row=1, column=1, columnspan=2, padx=10, pady=5)
        self.grade.grid(row=2, column=1, columnspan=2, padx=10, pady=5)
        self.semester.grid(row=3, column=1, columnspan=2, padx=10, pady=5)
        self.professor.grid(row=4, column=1, columnspan=2, padx=10, pady=5)

        # Buttons
        self.add_button = ttk.Button(self.master, text="Add Course", command=self.add_course)
        self.add_button.grid(row=5, column=0, columnspan=3, pady=10)

        self.calculate_button = ttk.Button(self.master, text="Calculate Rank", command=self.calculate_rank)
        self.calculate_button.grid(row=6, column=0, columnspan=3, pady=10)

        # Result display
        self.result_label = ttk.Label(self.master, text="")
        self.result_label.grid(row=7, column=0, columnspan=3, pady=10)

        self.toggle_mode()

    def toggle_mode(self):
        if self.mode.get() == "single":
            self.add_button.grid_remove()
        else:
            self.add_button.grid()

    def add_course(self):
        course = {
            "code": self.course_code.get(),
            "grade": self.grade.get(),
            "semester": self.semester.get(),
            "professor": self.professor.get()
        }
        self.courses.append(course)
        messagebox.showinfo("Course Added", f"Course {course['code']} added successfully!")
        self.clear_inputs()

    def clear_inputs(self):
        self.course_code.delete(0, tk.END)
        self.grade.set("")
        self.semester.delete(0, tk.END)
        self.professor.delete(0, tk.END)

    def calculate_rank(self):
        if self.mode.get() == "single":
            percentile = self.calculate_single_rank()
            self.result_label.config(text=f"Your percentile rank: {percentile}%")
        else:
            if not self.courses:
                messagebox.showwarning("No Courses", "Please add at least one course before calculating overall rank.")
                return
            average_percentile = self.calculate_overall_rank()
            self.result_label.config(text=f"Your average percentile rank: {average_percentile}%")

    def calculate_single_rank(self):
        # Replace this with actual calculation based on your data
        return round(random.uniform(0, 100), 2)

    def calculate_overall_rank(self):
        # Replace this with actual calculation based on your data
        return round(sum(random.uniform(0, 100) for _ in self.courses) / len(self.courses), 2)

root = tk.Tk()
app = BoilerRanks(root)
root.mainloop()