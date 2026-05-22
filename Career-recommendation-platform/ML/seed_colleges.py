"""
Seed script for populating college database with sample data
Run this after initializing the database
"""
from database import SessionLocal
from db_models import College

def seed_colleges():
    """Add sample college data to the database"""
    db = SessionLocal()

    # Sample colleges data
    colleges_data = [
        # IITs
        {
            "name": "Indian Institute of Technology Bombay",
            "location": "Powai, Mumbai",
            "state": "Maharashtra",
            "city": "Mumbai",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 1,
            "programs_offered": ["B.Tech CSE", "B.Tech EE", "B.Tech Mechanical", "B.Tech Civil", "B.Tech Chemical"],
            "entrance_exams": ["JEE Advanced"],
            "min_percentile": 99.5,
            "avg_fees_per_year": 2.5,
            "avg_placement_package": 21.0,
            "highest_placement": 1.5,  # in Cr
            "placement_percentage": 95.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Cafeteria"],
            "website": "https://www.iitb.ac.in",
            "description": "Premier engineering institution with world-class faculty and research facilities"
        },
        {
            "name": "Indian Institute of Technology Delhi",
            "location": "Hauz Khas, New Delhi",
            "state": "Delhi",
            "city": "New Delhi",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 2,
            "programs_offered": ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Production", "B.Tech Mathematics"],
            "entrance_exams": ["JEE Advanced"],
            "min_percentile": 99.4,
            "avg_fees_per_year": 2.5,
            "avg_placement_package": 18.5,
            "highest_placement": 1.2,
            "placement_percentage": 93.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Medical Center"],
            "website": "https://www.iitd.ac.in",
            "description": "Top-tier engineering college with excellent placement records and research opportunities"
        },
        # NITs
        {
            "name": "National Institute of Technology Trichy",
            "location": "Tiruchirappalli",
            "state": "Tamil Nadu",
            "city": "Tiruchirappalli",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 9,
            "programs_offered": ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Chemical", "B.Tech Civil"],
            "entrance_exams": ["JEE Main"],
            "min_percentile": 97.0,
            "avg_fees_per_year": 1.5,
            "avg_placement_package": 12.0,
            "highest_placement": 55.0,
            "placement_percentage": 90.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Gym"],
            "website": "https://www.nitt.edu",
            "description": "Top NIT with strong engineering programs and industry connections"
        },
        {
            "name": "National Institute of Technology Karnataka",
            "location": "Surathkal, Mangalore",
            "state": "Karnataka",
            "city": "Mangalore",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 13,
            "programs_offered": ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Civil"],
            "entrance_exams": ["JEE Main"],
            "min_percentile": 96.5,
            "avg_fees_per_year": 1.5,
            "avg_placement_package": 11.5,
            "highest_placement": 42.0,
            "placement_percentage": 88.0,
            "facilities": ["Library", "Hostel", "Beach Access", "Labs", "Cafeteria"],
            "website": "https://www.nitk.ac.in",
            "description": "Prestigious NIT with beautiful campus and strong technical programs"
        },
        # IIITs
        {
            "name": "IIIT Hyderabad",
            "location": "Gachibowli, Hyderabad",
            "state": "Telangana",
            "city": "Hyderabad",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 15,
            "programs_offered": ["B.Tech CSE", "B.Tech ECE", "B.Tech Computational Engineering"],
            "entrance_exams": ["JEE Main", "IIIT Hyderabad Entrance"],
            "min_percentile": 98.0,
            "avg_fees_per_year": 3.0,
            "avg_placement_package": 15.0,
            "highest_placement": 60.0,
            "placement_percentage": 92.0,
            "facilities": ["Library", "Hostel", "Research Labs", "Innovation Hub"],
            "website": "https://www.iiit.ac.in",
            "description": "Premier IT-focused institution with excellent research output and placements"
        },
        # Private Colleges
        {
            "name": "BITS Pilani",
            "location": "Pilani",
            "state": "Rajasthan",
            "city": "Pilani",
            "college_type": "Private",
            "affiliation": "Deemed University",
            "nirf_ranking": 25,
            "programs_offered": ["B.E. CSE", "B.E. ECE", "B.E. Mechanical", "B.E. Chemical", "B.Pharm"],
            "entrance_exams": ["BITSAT"],
            "min_percentile": 95.0,
            "avg_fees_per_year": 4.5,
            "avg_placement_package": 14.0,
            "highest_placement": 50.0,
            "placement_percentage": 87.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Labs", "Auditorium"],
            "website": "https://www.bits-pilani.ac.in",
            "description": "Top private engineering college with strong industry partnerships"
        },
        {
            "name": "VIT Vellore",
            "location": "Vellore",
            "state": "Tamil Nadu",
            "city": "Vellore",
            "college_type": "Private",
            "affiliation": "Deemed University",
            "nirf_ranking": 30,
            "programs_offered": ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Civil", "B.Tech Biotech"],
            "entrance_exams": ["VITEEE"],
            "min_percentile": 90.0,
            "avg_fees_per_year": 2.0,
            "avg_placement_package": 8.5,
            "highest_placement": 40.0,
            "placement_percentage": 85.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Medical Center", "Cafeteria"],
            "website": "https://www.vit.ac.in",
            "description": "Large private university with diverse programs and good placement records"
        },
        {
            "name": "Manipal Institute of Technology",
            "location": "Manipal",
            "state": "Karnataka",
            "city": "Manipal",
            "college_type": "Private",
            "affiliation": "Deemed University",
            "nirf_ranking": 35,
            "programs_offered": ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech Mechanical", "B.Tech Civil"],
            "entrance_exams": ["MET"],
            "min_percentile": 88.0,
            "avg_fees_per_year": 3.5,
            "avg_placement_package": 7.5,
            "highest_placement": 35.0,
            "placement_percentage": 82.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Medical Facilities", "Clubs"],
            "website": "https://www.manipal.edu",
            "description": "Well-established private institution with good infrastructure"
        },
        # State Universities
        {
            "name": "Delhi Technological University",
            "location": "Shahbad Daulatpur, Delhi",
            "state": "Delhi",
            "city": "New Delhi",
            "college_type": "Government",
            "affiliation": "State University",
            "nirf_ranking": 40,
            "programs_offered": ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech Software Engineering", "B.Tech Electrical"],
            "entrance_exams": ["JEE Main"],
            "min_percentile": 94.0,
            "avg_fees_per_year": 1.8,
            "avg_placement_package": 10.0,
            "highest_placement": 45.0,
            "placement_percentage": 85.0,
            "facilities": ["Library", "Hostel", "Sports Complex", "Innovation Lab"],
            "website": "https://www.dtu.ac.in",
            "description": "Premier state engineering university with strong placement support"
        },
        {
            "name": "Jadavpur University",
            "location": "Kolkata",
            "state": "West Bengal",
            "city": "Kolkata",
            "college_type": "Government",
            "affiliation": "State University",
            "nirf_ranking": 42,
            "programs_offered": ["B.E. CSE", "B.E. IT", "B.E. ECE", "B.E. Mechanical", "B.E. Civil"],
            "entrance_exams": ["JEE Main", "WBJEE"],
            "min_percentile": 92.0,
            "avg_fees_per_year": 0.5,
            "avg_placement_package": 9.0,
            "highest_placement": 38.0,
            "placement_percentage": 80.0,
            "facilities": ["Library", "Hostel", "Sports Ground", "Labs"],
            "website": "https://www.jadavpuruniversity.in",
            "description": "Prestigious state university with affordable fees and good academics"
        },
        # Management Colleges
        {
            "name": "IIM Ahmedabad",
            "location": "Ahmedabad",
            "state": "Gujarat",
            "city": "Ahmedabad",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 1,
            "programs_offered": ["MBA", "Executive MBA", "PhD Management"],
            "entrance_exams": ["CAT"],
            "min_percentile": 99.5,
            "avg_fees_per_year": 12.0,
            "avg_placement_package": 30.0,
            "highest_placement": 1.8,
            "placement_percentage": 100.0,
            "facilities": ["Library", "Hostel", "Case Study Rooms", "Sports Complex"],
            "website": "https://www.iima.ac.in",
            "description": "Top management institute in India with world-class MBA program"
        },
        {
            "name": "IIM Bangalore",
            "location": "Bangalore",
            "state": "Karnataka",
            "city": "Bangalore",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 2,
            "programs_offered": ["MBA", "Executive MBA", "PhD Management"],
            "entrance_exams": ["CAT"],
            "min_percentile": 99.4,
            "avg_fees_per_year": 12.5,
            "avg_placement_package": 28.0,
            "highest_placement": 1.5,
            "placement_percentage": 100.0,
            "facilities": ["Library", "Hostel", "Innovation Lab", "Fitness Center"],
            "website": "https://www.iimb.ac.in",
            "description": "Premier B-school with strong industry connections and research focus"
        },
        # Medical Colleges
        {
            "name": "AIIMS Delhi",
            "location": "Ansari Nagar, New Delhi",
            "state": "Delhi",
            "city": "New Delhi",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 1,
            "programs_offered": ["MBBS", "MD", "MS", "BSc Nursing"],
            "entrance_exams": ["NEET UG", "NEET PG"],
            "min_percentile": 99.9,
            "avg_fees_per_year": 0.1,
            "avg_placement_package": 12.0,
            "highest_placement": 25.0,
            "placement_percentage": 100.0,
            "facilities": ["Hospital", "Library", "Hostel", "Research Labs"],
            "website": "https://www.aiims.edu",
            "description": "Top medical institution with excellent clinical exposure and research"
        },
        # Law Colleges
        {
            "name": "NLSIU Bangalore",
            "location": "Bangalore",
            "state": "Karnataka",
            "city": "Bangalore",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 1,
            "programs_offered": ["BA LLB", "LLM", "PhD Law"],
            "entrance_exams": ["CLAT"],
            "min_percentile": 99.5,
            "avg_fees_per_year": 2.0,
            "avg_placement_package": 15.0,
            "highest_placement": 30.0,
            "placement_percentage": 95.0,
            "facilities": ["Library", "Hostel", "Moot Court", "Sports Complex"],
            "website": "https://www.nls.ac.in",
            "description": "Top law school in India with excellent faculty and placement support"
        },
        # Design Colleges
        {
            "name": "National Institute of Design Ahmedabad",
            "location": "Paldi, Ahmedabad",
            "state": "Gujarat",
            "city": "Ahmedabad",
            "college_type": "Government",
            "affiliation": "Autonomous",
            "nirf_ranking": 1,
            "programs_offered": ["B.Des Industrial Design", "B.Des Communication Design", "M.Des"],
            "entrance_exams": ["NID Entrance Exam"],
            "min_percentile": 95.0,
            "avg_fees_per_year": 3.0,
            "avg_placement_package": 8.0,
            "highest_placement": 20.0,
            "placement_percentage": 90.0,
            "facilities": ["Design Studios", "Workshop", "Library", "Hostel"],
            "website": "https://www.nid.edu",
            "description": "Premier design institute with focus on innovation and creativity"
        },
    ]

    # Add colleges to database
    print(f"Adding {len(colleges_data)} colleges to database...")

    for college_data in colleges_data:
        # Check if college already exists
        existing = db.query(College).filter(College.name == college_data["name"]).first()

        if not existing:
            college = College(**college_data)
            db.add(college)
            print(f"  ✓ Added: {college_data['name']}")
        else:
            print(f"  - Skipped (already exists): {college_data['name']}")

    db.commit()
    db.close()

    print(f"\n✅ College database seeded successfully!")

if __name__ == "__main__":
    seed_colleges()
