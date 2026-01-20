# TC_INST_01: Create Instrument Master

**Module**: Instrument
**Test Type**: End-to-End (Hybrid)
**Priority**: High

## 1. Description
Verify that a Lab Admin can successfully create a new Instrument Master record, and that the data is correctly persisted in the backend database.

## 2. Pre-Requisites
1.  **Browser**: Chrome/Edge (Headless or UI).
2.  **User**: Logged in as a user with `Admin` or `Lab Manager` privileges.
3.  **Data**: A valid "Lab ID" must be associated with the user.

## 3. Test Data (Input)
**Source**: `testdata/TC_INST_01.json`

The test script will read an array of Instrument objects. Each object contains:

| Field | Description |
| :--- | :--- |
| **InstrumentName** | Unique name for the instrument |
| **Discipline** | Instrument Discipline (e.g. Electrical) |
| **Group** | Instrument Group (e.g. Multimeter) |
| **UOM** | Unit of Measurement (e.g. Volts) |
| **LabTypes** (Array) | List of Lab Types to select |
| - `Type` | e.g. "NABL", "SERVICE" |
| - `RangeMin` / `RangeMax` | Accept Range values |
| - `RangeUnit` / `DecimalPlace` | Unit and precision |
| **Parameters** (Array) | List of parameters to add |
| - `ParamName` | Parameter Name |
| - `UOM` | Valid Range |

*Note: The script iterates through `LabTypes` to fill dynamic range fields and `Parameters` to add multiple entries.*

## 4. Test Steps & Validations

| Step # | Action (Frontend) | Input Data | Expected Result (UI) | Verification (Backend/Hybrid) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Navigate to **Dashboard** > **Instrument Master**. | N/A | List of instruments is displayed. | |
| **2** | Click **"Add Instrument"** button. | N/A | **InstrumentForm** loads. | |
| **3** | **Validation Test**: Click "Save" without filling any data. | N/A | **Field Errors Displayed**: <br>1. "Please enter instrument name"<br>2. "Please select UOM"<br>3. "Please select discipline"<br>4. "Please select group" | |
| **4** | Fill **Instrument Name**, **UOM**, **Discipline** fields. | `Name`, `UOM`, `Discipline` | No errors for these fields. Group dropdown enables. | |
| **5** | Select **Group**. | `Group` | "Please select group" error clears. | |
| **6** | Select **Lab Type(s)**. | `LabTypes`: *Loop through array* | **Dynamic Rendering**: For each selected Lab Type, a specific "Accept Range" section appears. | |
| **7** | **Lab Type Validation**: Click Save without filling new range fields. | N/A | **Field Errors**: "Please enter min/max" for specific lab sections. | |
| **8** | Fill **Accept Range** fields for EACH selected Lab Type. | `LabTypes` > `RangeMin`, `RangeMax`, `Unit` | Errors clear for all sections. | |
| **9** | **Parameter Validation**: Click "Save" without adding parameters. | N/A | Error Message: **"Please add at least one Instrument Parameter"**. | |
| **10** | Click **"Add Instrument Parameters"**. | N/A | Open **Add Parameter** Modal. | |
| **11** | Loop through **Parameters** array: Fill Details and Click **"Add"**. | `Parameters` > `ParamName`, `Range`, `Accuracy` | Parameter added to grid. (Repeat for all items). | |
| **12** | Click **"Save"** (Main Form). | N/A | 1. Success Notification: **"Instrument Created"**.<br>2. Redirects to List. | **API Check**: `POST /api/instrument/create` returns `200 OK`. |

## 5. Post-Condition
- A new valid instrument record satisfies the `List` and `Search` queries.
- **Cleanup**: Delete the created instrument to restore state.
