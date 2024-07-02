# Copyright (c) 2024, vishwajeet and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _
# from PIL import Image
# import subprocess

class Beneficiary(Document):
    pass


def validate_registration_number(doc, method):
    if not doc.registration_number:
        frappe.throw(_("Registration Number is required"))

    # Add custom validation logic here
    if not is_valid_registration_number_format(doc.registration_number):
        frappe.throw(_("Invalid Registration Number format"))

def is_valid_registration_number_format(registration_number):
    # Check if the length is exactly 7 characters
    if len(registration_number) != 7:
        return False
    
    # Check the format of each segment
    if (not registration_number[:1].isalpha() or        # First character should be a letter
        not registration_number[1:4].isdigit() or      # Next three characters should be digits
        not registration_number[4:].isalpha()):        # Last three characters should be letters
        return False
    
    # If all conditions pass, the registration number format is valid
    return True

# Hook this function to the DocType
doc_events = {
    "YourDocType": {
        "validate": "suvaidyam_management.suvaidyam.validate_registration_number"
    }
}