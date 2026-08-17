from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, Flowable
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import io

RASHI_MAP = {
    "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
    "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
    "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
}

class NorthIndianChart(Flowable):
    def __init__(self, planet_data, width=400, height=300):
        Flowable.__init__(self)
        self.planet_data = planet_data
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        w = self.width
        h = self.height
        
        # Draw Border
        c.setStrokeColor(colors.gold)
        c.setLineWidth(2)
        c.rect(0, 0, w, h)
        
        # Draw Diagonals
        c.line(0, h, w, 0)
        c.line(0, 0, w, h)
        
        # Draw Diamond (Midpoints)
        mid_x = w / 2
        mid_y = h / 2
        c.line(0, mid_y, mid_x, h)
        c.line(mid_x, h, w, mid_y)
        c.line(w, mid_y, mid_x, 0)
        c.line(mid_x, 0, 0, mid_y)
        
        # Centers for Houses (1-12)
        # 1=Top, 4=Left, 7=Bot, 10=Right (Inner Kendras)
        # 2,3 = Top-Left; 5,6 = Bot-Left; 8,9 = Bot-Right; 11,12 = Top-Right
        centers = {
            1: (mid_x, h * 0.75),        # Top Center (Diamond)
            2: (w * 0.35, h * 0.88),     # Top Left (Upper)
            3: (w * 0.12, h * 0.65),     # Top Left (Lower)
            4: (w * 0.25, mid_y),        # Left Center (Diamond)
            5: (w * 0.12, h * 0.35),     # Bot Left (Upper)
            6: (w * 0.35, h * 0.12),     # Bot Left (Lower)
            7: (mid_x, h * 0.25),        # Bot Center (Diamond)
            8: (w * 0.65, h * 0.12),     # Bot Right (Lower)
            9: (w * 0.88, h * 0.35),     # Bot Right (Upper)
            10: (w * 0.75, mid_y),       # Right Center (Diamond)
            11: (w * 0.88, h * 0.65),    # Top Right (Lower)
            12: (w * 0.65, h * 0.88)     # Top Right (Upper)
        }
        
        # Get Ascendant Rashi Number
        asc_rashi_name = self.planet_data.get("Ascendant", {}).get("Sign", "Aries")
        start_rashi = RASHI_MAP.get(asc_rashi_name, 1)
        
        # Draw Rashi Numbers (Red/Brown for distinctness)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(colors.darkred)
        
        for i in range(1, 13):
            rashi_num = (start_rashi + i - 2) % 12 + 1
            cx, cy = centers[i]
            
            # Draw Rashi number slightly offset in the corner of the house
            # Inner Houses (1,4,7,10): Top corner
            # Outer Houses: Inner corner
            if i in [1, 4, 7, 10]:
                if i == 1: ry = cy - 20
                elif i == 4: ry = cy ; cx += 15
                elif i == 7: ry = cy + 20
                elif i == 10: ry = cy; cx -= 15
                else: ry = cy
                c.drawString(cx - 3, ry, str(rashi_num))
            else:
                 # Just center it distinct from planets
                 c.drawString(cx - 3, cy + 10, str(rashi_num))
            
        # Draw Planets (Black for visibility)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(colors.black)
        
        # Group planets by House Index relative to Ascendant
        house_planets = {i: [] for i in range(1, 13)}
        
        for planet, details in self.planet_data.items():
            if planet == "Ascendant": 
                house_planets[1].append("Asc")
                continue
                
            if isinstance(details, dict):
                p_rashi_num = details.get("house") # This is actually the Sign Number (1-12)
                if p_rashi_num:
                    # Calculate House Index: (Sign - AscSign) % 12 + 1
                    # Python's % handles negatives correctly: (1 - 2) % 12 = 11 -> +1 = 12
                    h_idx = (p_rashi_num - start_rashi) % 12 + 1
                    
                    # Abbreviate planet names
                    p_name = planet[:2]
                    if planet == "Saturn": p_name = "Sa"
                    elif planet == "Jupiter": p_name = "Ju"
                    elif planet == "Mercury": p_name = "Me"
                    elif planet == "Mars": p_name = "Ma"
                    elif planet == "Venus": p_name = "Ve"
                    elif planet == "Moon": p_name = "Mo"
                    elif planet == "Sun": p_name = "Su"
                    elif planet == "Rahu": p_name = "Ra"
                    elif planet == "Ketu": p_name = "Ke"
                    
                    house_planets[h_idx].append(p_name)
        
        for h_num, planets in house_planets.items():
            if not planets: continue
            cx, cy = centers[h_num]
            # Draw below the Rashi number
            # Split if too many?
            p_str = " ".join(planets)
            c.drawCentredString(cx, cy - 5, p_str)



def draw_cover_page(c, doc, user_data):
    """
    Draws a decorative cover page directly on the canvas.
    """
    c.saveState()
    width, height = A4
    
    # --- Background & Border ---
    # Draw a dark background
    c.setFillColorRGB(0.05, 0.05, 0.1)  # Cosmic Dark (approx #0D0D1A)
    c.rect(0, 0, width, height, fill=1)
    
    # Gold Border
    c.setStrokeColorRGB(0.83, 0.68, 0.21) # Gold (approx #D4AF37)
    c.setLineWidth(3)
    c.rect(20, 20, width-40, height-40)
    
    # Inner thin border
    c.setLineWidth(1)
    c.rect(25, 25, width-50, height-50)
    
    # --- Corner Decorations (Simple Lines) ---
    c.setLineWidth(2)
    # Top Left
    c.line(20, height-20, 100, height-20)
    c.line(20, height-20, 20, height-100)
    # Bottom Right
    c.line(width-20, 20, width-100, 20)
    c.line(width-20, 20, width-20, 100)
    
    # --- Title Section ---
    c.setFillColorRGB(0.83, 0.68, 0.21) # Gold
    c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(width/2, height - 200, "The AstroPulse")
    
    c.setFillColorRGB(1, 1, 1) # White
    c.setFont("Helvetica", 18)
    c.drawCentredString(width/2, height - 240, "Vedic Astrology Report")
    
    # --- User Details Box ---
    box_width = 400
    box_height = 200
    box_x = (width - box_width) / 2
    box_y = height / 2 - 50
    
    # Semi-transparent box (simulated with just a border/fill)
    c.setFillColorRGB(1, 1, 1, 0.05) # Very faint white fill
    c.setStrokeColorRGB(0.83, 0.68, 0.21)
    c.rect(box_x, box_y, box_width, box_height, fill=1, stroke=1)
    
    # Text inside box
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, box_y + 150, f"Prepared for: {user_data.get('name', 'Seeker')}")
    
    c.setFont("Helvetica", 12)
    c.drawCentredString(width/2, box_y + 110, f"Date of Birth: {user_data.get('dob')}")
    c.drawCentredString(width/2, box_y + 80, f"Time of Birth: {user_data.get('tob')}")
    c.drawCentredString(width/2, box_y + 50, f"Place of Birth: {user_data.get('lob')}")
    
    # --- Footer ---
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColorRGB(0.7, 0.7, 0.7) # Light Grey
    c.drawCentredString(width/2, 50, "Generated by TheAstroPulse AI & Vedic Technology")
    
    c.restoreState()

def on_later_pages(c, doc):
    """
    Header/Footer for subsequent pages.
    """
    c.saveState()
    width, height = A4
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.grey)
    c.drawString(50, height - 30, "TheAstroPulse - Confidential Report")
    c.drawRightString(width - 50, height - 30, f"Page {doc.page}")
    c.restoreState()

def generate_pdf(astro_data, user_details):
    """
    Generates a PDF report based on the provided astro_data.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, spaceAfter=20, textColor=colors.darkblue)
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Heading2'], fontSize=18, spaceAfter=12, textColor=colors.darkred)
    normal_style = styles['Normal']
    normal_style.fontSize = 12
    normal_style.leading = 14
    
    elements = []
    
    # --- 1. Cover Page ---
    # We will use a spacer to push content down if needed, but since we have a custom draw function,
    # we can just start adding content. The cover_func will draw the background on the first page.
    
    # Add a Spacer to push the "Astrological Details" title down on the SECOND page?
    # No, we want the cover page to be page 1.
    # The 'onFirstPage' callback draws on the canvas of the first page.
    # If we add content immediately, it will be drawn ON TOP of the cover page background.
    # So we need to force a page break AFTER the cover page content.
    
    # Strategy:
    # 1. We don't add flowables for the cover texts (Title, User Details) because 'draw_cover_page' handles them on the canvas.
    # 2. We just need to ensure the first page has nothing else on it.
    # 3. We can add a PageBreak() as the FIRST element. 
    #    BUT: If we do that, the 'onFirstPage' might be applied to the *blank* page or the page *after* the break depending on implementation.
    #    Actually, `PageBreak` forces a new page *after* the current one.
    
    # Correct Approach for SimpleDocTemplate with a full-canvas cover:
    # 1. Use 'onFirstPage' to draw the cover.
    # 2. Add a 'PageBreak' as the first flowable relative to the *content* flow?
    #    If we add PageBreak() as the first element, reportlab starts on Page 1, sees PageBreak, and moves to Page 2.
    #    So Page 1 is empty (except for what onFirstPage draws) and Page 2 starts the text.
    #    This is exactly what we want!
    
    elements.append(PageBreak()) 
    
    # --- 2. Introduction (Starts on Page 2) ---
    
    elements.append(Paragraph("Astrological Details", title_style))
    elements.append(Paragraph("Use the data below to understand your planetary positions and cosmic influences.", normal_style))
    elements.append(Spacer(1, 20))

    # --- 2.1 Basic Details & Panchang ---
    if len(astro_data) > 0:
        basic_details = astro_data[0]
        
        # A. Panchang Table
        elements.append(Paragraph("Panchang Details", subtitle_style))
        panchang_data = [
            ["Attribute", "Value"],
            ["Tithi", basic_details.get('tithi', '-')],
            ["Vara (Day)", basic_details.get('vara', '-')],
            ["Nakshatra", f"{basic_details.get('nakshatra_name', '-')} (Pada {basic_details.get('nakshatra_pada', '-')})"],
            ["Yoga", basic_details.get('yog_name', '-')],
            ["Karana", basic_details.get('karan_name', '-')],
            ["Ayanamsa", "Lahiri"] # Hardcoded as per system default
        ]
        
        t_panchang = Table(panchang_data, colWidths=[200, 250], hAlign='LEFT')
        t_panchang.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.aliceblue),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(t_panchang)
        elements.append(Spacer(1, 20))

        # B. Avakahada Chakra (Nakshatra Details)
        if "nakshtra_all_details" in basic_details:
             nak_det = basic_details["nakshtra_all_details"]
             elements.append(Paragraph("Avakahada Chakra", subtitle_style))
             
             avakahada_data = [
                 ["Attribute", "Value"],
                 ["Varna", nak_det.get('varna', '-')],
                 ["Vashya", nak_det.get('yoni', '-')], # Mapping Yoni to Vashya contextually or just listing Yoni
                 ["Yoni", nak_det.get('yoni', '-')],
                 ["Gana", nak_det.get('gana', '-')],
                 ["Nadi", nak_det.get('nadi', '-')],
                 ["Symbol", nak_det.get('symbol', '-')],
                 ["Deity", nak_det.get('deity', '-')],
                 ["Ruling Planet", nak_det.get('ruling_planet', '-')],
                 ["Lucky Alphabet", ", ".join(nak_det.get('fav_alphabet', []))]
             ]
             
             t_avakahada = Table(avakahada_data, colWidths=[200, 250], hAlign='LEFT')
             t_avakahada.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkgreen),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.honeydew),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
             ]))
             elements.append(t_avakahada)
             elements.append(Spacer(1, 30))
    
    # --- 3. Planetary Positions Table ---
    if len(astro_data) > 1: 
        planet_data = astro_data[1]
        
        elements.append(Paragraph("Lagna Chart (North Indian)", subtitle_style))
        chart = NorthIndianChart(planet_data, width=400, height=250)
        # Center the chart
        # Flowables are placed in the frame. We can put it in a Table to center it or just append.
        # SimpleDocTemplate centers flowables? No, it fills left to right.
        # Let's wrap in a table to center or just append.
        # There isn't a simple "Center Flowable" wrapper easily available without Table.
        # But we can set the chart width to fit margins and it will look okay.
        # Adjust chart width to be centered manually? 
        # Let's just append it.
        
        # Use a Table to center the chart efficiently
        t_chart = Table([[chart]], colWidths=[450])
        t_chart.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        elements.append(t_chart)
        elements.append(Spacer(1, 20))


        elements.append(Paragraph("Planetary Positions Details", subtitle_style)) 
        
        table_data = [['Planet', 'Sign', 'Degree', 'Nakshatra', 'Lord']]
        
        # Iterate over planets
        for planet, details in planet_data.items():
            if isinstance(details, dict):
                 # Fix: Use 'Sign' instead of 'Rashi', handle degree formatting
                 degree_val = details.get('Degree in sign', '-')
                 if isinstance(degree_val, float):
                     degree_str = f"{degree_val:.2f}"
                 else:
                     degree_str = str(degree_val)

                 table_data.append([
                     planet,
                     details.get('Sign', '-'), # Changed from Rashi to Sign
                     degree_str,
                     details.get('Nakshatra', '-'),
                     details.get('NakLord', '-')
                 ])
        
        t = Table(table_data, colWidths=[100, 100, 80, 100, 80])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.aliceblue),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 30))

    # --- 4. Dasha Analysis ---
    if len(astro_data) > 2:
        dasha_root = astro_data[2]
        # Fix: Check for 'vimshottariDasha' key
        if "vimshottariDasha" in dasha_root:
            dasha_main = dasha_root["vimshottariDasha"]
            
            elements.append(Paragraph("Vimshottari Dasha (Maha Dasha)", title_style))
            elements.append(Paragraph("Timeline of major planetary periods:", normal_style))
            elements.append(Spacer(1, 10))
            
            # Create Dasha Table
            dasha_table_data = [['Planet', 'Start Date', 'End Date']]
            for planet, periods in dasha_main.items():
                dasha_table_data.append([
                    planet, 
                    periods.get('start_date', '-'), 
                    periods.get('end_date', '-')
                ])
                
            dt = Table(dasha_table_data, colWidths=[150, 100, 100], hAlign='LEFT')
            dt.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.antiquewhite),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ]))
            elements.append(dt)
        else:
             # Fallback if structure is different
             elements.append(Paragraph("Dasha Details", title_style))
             elements.append(Paragraph(str(dasha_root), normal_style))
    
    # Build PDF
    # We pass user_data as a lambda/partial to the draw function
    from functools import partial
    cover_func = partial(draw_cover_page, user_data=user_details)
    
    # Note: onFirstPage executes on the first page of the CONTENT. 
    # To truly have a custom cover page, the best way in simpledoctemplate is to put no flowables on page 1?
    # Actually, SimpleDocTemplate fills frames. 
    # We will use a MultiBuild or just let the first page be the cover
    # Modification: The 'PageBreak' at the start of 'elements' puts content on page 2.
    # The 'onFirstPage' draws the background.
    
    doc.build(elements, onFirstPage=cover_func, onLaterPages=on_later_pages)
    
    buffer.seek(0)
    return buffer
