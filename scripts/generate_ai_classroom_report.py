#!/usr/bin/env python3
"""
AI Classroom Experiment Report Generator
Generates a PDF report with charts for the Sequence Convergence simulation pedagogical study.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.backends.backend_pdf import PdfPages
import numpy as np
from datetime import datetime

# =============================================================================
# EXPERIMENTAL DATA
# =============================================================================

# Target audience results (Priya → Yuki)
TARGET_AUDIENCE = [
    {"name": "Priya", "profile": "Physics intuition", "control": 5, "treatment": 7, "insight": '"N is a FUNCTION of ε"'},
    {"name": "Marcus", "profile": "Geometric/visual", "control": 7, "treatment": 7, "insight": "Simulation is like 'Constructing' the Definition"},
    {"name": "Sasha", "profile": "Computational/CS", "control": 6, "treatment": 7, "insight": "Definition = spec, Simulation = implementation"},
    {"name": "Elena Z.", "profile": "Triple gold", "control": 9.5, "treatment": 9.55, "insight": "Custom sequences, wrong L attempts, N(ε) staircase"},
    {"name": "Aditya", "profile": "JEE AIR 1", "control": 7, "treatment": 7, "insight": None},
    {"name": "Arjun", "profile": "IPhO gold", "control": 7, "treatment": 7.5, "insight": None},
    {"name": "Viktor", "profile": "IOI gold", "control": 6, "treatment": 7, "insight": "Definition = spec, Simulation = implementation"},
    {"name": "Yuki", "profile": "IMO gold", "control": 8, "treatment": 8, "insight": None},
]

# Non-target audience (for comparison)
NON_TARGET = [
    {"name": "Raj", "profile": "Pre-med memorizer", "control": 6, "treatment": 6, "insight": "Wants procedures, not understanding"},
    {"name": "Amy", "profile": "Math-anxious", "control": 1, "treatment": 6, "insight": "(Idealized response)"},
    {"name": "Tyler", "profile": "Overconfident", "control": 9, "treatment": 7, "insight": "Humbled by Challenge Mode"},
]

# Colors
COLORS = {
    'primary': '#FF6319',      # Orange (P-line)
    'secondary': '#0039A6',    # Blue
    'positive': '#6CBE45',     # Green
    'negative': '#EE352E',     # Red
    'neutral': '#888888',      # Gray
    'background': '#1a1a2e',   # Dark bg
    'text': '#ffffff',         # White text
}

# =============================================================================
# CHART GENERATION FUNCTIONS
# =============================================================================

def setup_dark_style():
    """Configure matplotlib for dark theme."""
    plt.style.use('dark_background')
    plt.rcParams.update({
        'font.family': 'sans-serif',
        'font.size': 10,
        'axes.titlesize': 14,
        'axes.labelsize': 11,
        'xtick.labelsize': 9,
        'ytick.labelsize': 9,
        'legend.fontsize': 9,
        'figure.facecolor': COLORS['background'],
        'axes.facecolor': '#16213e',
        'axes.edgecolor': '#444444',
        'axes.labelcolor': COLORS['text'],
        'xtick.color': COLORS['text'],
        'ytick.color': COLORS['text'],
        'text.color': COLORS['text'],
        'grid.color': '#333333',
        'grid.alpha': 0.5,
    })

def create_title_page(pdf):
    """Create the title page."""
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')

    # Title
    ax.text(0.5, 0.7, 'AI Classroom Experiment', fontsize=32, fontweight='bold',
            ha='center', va='center', color=COLORS['primary'])

    # Subtitle
    ax.text(0.5, 0.58, 'Pedagogical Effectiveness of the\nSequence Convergence Simulation',
            fontsize=18, ha='center', va='center', color=COLORS['text'], linespacing=1.5)

    # Decorative line
    ax.axhline(y=0.48, xmin=0.2, xmax=0.8, color=COLORS['primary'], linewidth=2)

    # Details
    ax.text(0.5, 0.35, 'Testing the ε-N Definition Visualizer\nwith 15 AI Student Agents',
            fontsize=14, ha='center', va='center', color=COLORS['neutral'], linespacing=1.5)

    # Date
    ax.text(0.5, 0.15, f'Generated: {datetime.now().strftime("%B %d, %Y")}',
            fontsize=11, ha='center', va='center', color=COLORS['neutral'])

    # Footer
    ax.text(0.5, 0.05, 'Vivek Karmarkar · Personal Website Project',
            fontsize=10, ha='center', va='center', color='#666666')

    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_executive_summary(pdf):
    """Create executive summary page."""
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')

    # Title
    ax.text(0.5, 0.92, 'Executive Summary', fontsize=24, fontweight='bold',
            ha='center', color=COLORS['primary'])

    # Calculate stats
    improvements = [s['treatment'] - s['control'] for s in TARGET_AUDIENCE]
    mean_improvement = np.mean(improvements)
    positive_count = sum(1 for i in improvements if i > 0)

    # Key metrics boxes
    metrics = [
        ('Mean Improvement', f'+{mean_improvement:.2f}', 'points'),
        ('Students Improved', f'{positive_count}/{len(TARGET_AUDIENCE)}', 'in target audience'),
        ('Actionable Insights', '3', 'feature suggestions'),
        ('Agent Types', '15', 'student personas'),
    ]

    box_y = 0.75
    for i, (label, value, unit) in enumerate(metrics):
        x = 0.15 + (i * 0.22)

        # Box background
        rect = mpatches.FancyBboxPatch((x-0.08, box_y-0.08), 0.16, 0.12,
                                        boxstyle="round,pad=0.01",
                                        facecolor='#16213e', edgecolor=COLORS['primary'],
                                        linewidth=2)
        ax.add_patch(rect)

        ax.text(x, box_y+0.01, value, fontsize=20, fontweight='bold',
                ha='center', va='center', color=COLORS['primary'])
        ax.text(x, box_y-0.045, f'{label}\n{unit}', fontsize=8,
                ha='center', va='center', color=COLORS['neutral'], linespacing=1.3)

    # Key findings
    ax.text(0.08, 0.55, 'Key Findings', fontsize=16, fontweight='bold', color=COLORS['text'])

    findings = [
        '• CS-background students independently articulated "definition = specification,\n  simulation = implementation" — a powerful pedagogical framing',
        '• Physics-intuition learners showed strongest improvement (+2 points)',
        '• Olympiad-level students hit ceiling effects but provided valuable feature suggestions',
        '• Memorizers (Raj) showed zero improvement — validates target audience selection',
        '• Overconfident students (Tyler) were humbled by Challenge Mode (-2 points)',
    ]

    y = 0.48
    for finding in findings:
        ax.text(0.08, y, finding, fontsize=10, color=COLORS['text'], linespacing=1.4)
        y -= 0.085

    # Target audience note
    ax.text(0.08, 0.12, 'Target Audience:', fontsize=12, fontweight='bold', color=COLORS['primary'])
    ax.text(0.08, 0.06, 'Physics-intuition freshman (Priya) → IMO gold medalist (Yuki)\n'
                        'Explicitly NOT procedural memorizers or math-anxious students',
            fontsize=10, color=COLORS['neutral'], linespacing=1.4)

    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_improvement_chart(pdf):
    """Create bar chart showing improvement scores."""
    fig, ax = plt.subplots(figsize=(11, 8.5))

    names = [s['name'] for s in TARGET_AUDIENCE]
    improvements = [s['treatment'] - s['control'] for s in TARGET_AUDIENCE]

    # Color bars based on improvement
    colors = [COLORS['positive'] if i > 0 else COLORS['neutral'] for i in improvements]

    bars = ax.barh(names, improvements, color=colors, edgecolor='white', linewidth=0.5)

    # Add value labels
    for bar, imp in zip(bars, improvements):
        width = bar.get_width()
        label_x = width + 0.05 if width >= 0 else width - 0.05
        ha = 'left' if width >= 0 else 'right'
        ax.text(label_x, bar.get_y() + bar.get_height()/2,
                f'+{imp:.2f}' if imp > 0 else f'{imp:.2f}',
                va='center', ha=ha, fontsize=10, fontweight='bold',
                color=COLORS['positive'] if imp > 0 else COLORS['neutral'])

    ax.axvline(x=0, color='white', linewidth=0.8)
    ax.set_xlabel('Improvement (Treatment - Control)', fontsize=12)
    ax.set_title('Confidence Score Improvement by Student\n(Target Audience: Priya → Yuki)',
                 fontsize=16, fontweight='bold', color=COLORS['primary'], pad=20)

    ax.set_xlim(-0.5, 2.5)
    ax.grid(axis='x', alpha=0.3)

    # Add mean line
    mean_imp = np.mean(improvements)
    ax.axvline(x=mean_imp, color=COLORS['primary'], linewidth=2, linestyle='--', label=f'Mean: +{mean_imp:.2f}')
    ax.legend(loc='lower right')

    plt.tight_layout()
    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_before_after_chart(pdf):
    """Create grouped bar chart showing before/after scores."""
    fig, ax = plt.subplots(figsize=(11, 8.5))

    names = [s['name'] for s in TARGET_AUDIENCE]
    control = [s['control'] for s in TARGET_AUDIENCE]
    treatment = [s['treatment'] for s in TARGET_AUDIENCE]

    x = np.arange(len(names))
    width = 0.35

    bars1 = ax.bar(x - width/2, control, width, label='Control (Symbolic)',
                   color=COLORS['secondary'], edgecolor='white', linewidth=0.5)
    bars2 = ax.bar(x + width/2, treatment, width, label='Treatment (Simulation)',
                   color=COLORS['positive'], edgecolor='white', linewidth=0.5)

    ax.set_ylabel('Confidence Score (0-10)', fontsize=12)
    ax.set_title('Control vs Treatment Scores by Student',
                 fontsize=16, fontweight='bold', color=COLORS['primary'], pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(names, rotation=45, ha='right')
    ax.legend(loc='upper right')
    ax.set_ylim(0, 11)
    ax.grid(axis='y', alpha=0.3)

    # Add score labels on bars
    for bar in bars1:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, height + 0.1, f'{height:.1f}',
                ha='center', va='bottom', fontsize=8, color=COLORS['secondary'])

    for bar in bars2:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, height + 0.1, f'{height:.1f}',
                ha='center', va='bottom', fontsize=8, color=COLORS['positive'])

    plt.tight_layout()
    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_profile_breakdown(pdf):
    """Create chart showing results by student profile type."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 8.5))

    # Group by profile type
    profile_groups = {
        'Physics/Visual': ['Priya', 'Marcus'],
        'Computational': ['Sasha', 'Viktor'],
        'Olympiad': ['Elena Z.', 'Aditya', 'Arjun', 'Yuki'],
    }

    group_improvements = {}
    for group, names in profile_groups.items():
        imps = [s['treatment'] - s['control'] for s in TARGET_AUDIENCE if s['name'] in names]
        group_improvements[group] = np.mean(imps)

    # Left chart: Average improvement by group
    groups = list(group_improvements.keys())
    avgs = list(group_improvements.values())
    colors = [COLORS['positive'] if a > 0 else COLORS['neutral'] for a in avgs]

    bars = ax1.bar(groups, avgs, color=colors, edgecolor='white', linewidth=0.5)
    ax1.set_ylabel('Mean Improvement', fontsize=11)
    ax1.set_title('Improvement by Profile Type', fontsize=14, fontweight='bold', color=COLORS['primary'])
    ax1.axhline(y=0, color='white', linewidth=0.8)
    ax1.set_ylim(-0.5, 1.5)
    ax1.grid(axis='y', alpha=0.3)

    for bar, avg in zip(bars, avgs):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
                f'+{avg:.2f}', ha='center', va='bottom', fontsize=10, fontweight='bold')

    # Right chart: Distribution of improvements
    all_imps = [s['treatment'] - s['control'] for s in TARGET_AUDIENCE]

    ax2.hist(all_imps, bins=[-0.5, 0, 0.5, 1, 1.5, 2, 2.5],
             color=COLORS['primary'], edgecolor='white', linewidth=0.5)
    ax2.set_xlabel('Improvement (points)', fontsize=11)
    ax2.set_ylabel('Number of Students', fontsize=11)
    ax2.set_title('Distribution of Improvements', fontsize=14, fontweight='bold', color=COLORS['primary'])
    ax2.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_insights_page(pdf):
    """Create page showing actionable insights."""
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')

    ax.text(0.5, 0.92, 'Actionable Insights', fontsize=24, fontweight='bold',
            ha='center', color=COLORS['primary'])

    # Insight categories
    ax.text(0.08, 0.82, 'Feature Suggestions (from Elena Z. - Triple Gold Medalist)',
            fontsize=14, fontweight='bold', color=COLORS['positive'])

    features = [
        ('Custom Sequence Input', 'Let users define their own sequence formulas to test'),
        ('Wrong Limit Attempts', 'Allow guessing L and see what happens when wrong'),
        ('N(ε) Staircase Distribution', 'Visualize how N changes as ε decreases'),
    ]

    y = 0.74
    for i, (title, desc) in enumerate(features, 1):
        ax.text(0.10, y, f'{i}. {title}', fontsize=12, fontweight='bold', color=COLORS['text'])
        ax.text(0.13, y-0.04, desc, fontsize=10, color=COLORS['neutral'])
        y -= 0.10

    # Pedagogical insights
    ax.text(0.08, 0.42, 'Pedagogical Framings Discovered',
            fontsize=14, fontweight='bold', color=COLORS['secondary'])

    framings = [
        ('"Definition = Specification, Simulation = Implementation"',
         'CS students (Sasha, Viktor) independently arrived at this framing.\nPowerful for computational thinkers.'),
        ('"Simulation is like Constructing the Definition"',
         'Visual learner (Marcus) saw it as building understanding step-by-step.'),
        ('"N is a FUNCTION of ε"',
         'Physics student (Priya) grasped the functional dependency.\nCore insight the simulation conveys.'),
    ]

    y = 0.34
    for title, desc in framings:
        ax.text(0.10, y, f'• {title}', fontsize=11, fontweight='bold', color=COLORS['text'])
        ax.text(0.13, y-0.05, desc, fontsize=9, color=COLORS['neutral'], linespacing=1.3)
        y -= 0.12

    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_non_target_comparison(pdf):
    """Create comparison with non-target audience."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 8.5))

    # Left: Non-target audience results
    names = [s['name'] for s in NON_TARGET]
    improvements = [s['treatment'] - s['control'] for s in NON_TARGET]
    colors = [COLORS['positive'] if i > 0 else COLORS['negative'] if i < 0 else COLORS['neutral']
              for i in improvements]

    bars = ax1.barh(names, improvements, color=colors, edgecolor='white', linewidth=0.5)
    ax1.axvline(x=0, color='white', linewidth=0.8)
    ax1.set_xlabel('Improvement', fontsize=11)
    ax1.set_title('Non-Target Audience Results\n(For Comparison)',
                  fontsize=14, fontweight='bold', color=COLORS['primary'])
    ax1.set_xlim(-3, 6)
    ax1.grid(axis='x', alpha=0.3)

    for bar, imp in zip(bars, improvements):
        width = bar.get_width()
        label_x = width + 0.1 if width >= 0 else width - 0.1
        ha = 'left' if width >= 0 else 'right'
        label = f'+{imp}' if imp > 0 else str(imp)
        ax1.text(label_x, bar.get_y() + bar.get_height()/2, label,
                va='center', ha=ha, fontsize=10, fontweight='bold')

    # Right: Why they're not target
    ax2.axis('off')
    ax2.text(0.1, 0.85, 'Why Not Target Audience?', fontsize=14, fontweight='bold', color=COLORS['primary'])

    explanations = [
        ('Raj (Memorizer)',
         'Zero improvement despite simulation.\nWants procedures, not understanding.\nMirrors real pre-med classroom behavior.',
         COLORS['neutral']),
        ('Amy (Math-anxious)',
         '+5 improvement flagged as idealized.\nReal anxiety reduction needs validation.\nResponse too optimistic.',
         COLORS['neutral']),
        ('Tyler (Overconfident)',
         '-2 points: humbled by Challenge Mode.\nNot a failure of simulation—\nexposes Dunning-Kruger effect.',
         COLORS['negative']),
    ]

    y = 0.7
    for name, text, color in explanations:
        ax2.text(0.1, y, name, fontsize=12, fontweight='bold', color=color)
        ax2.text(0.1, y-0.05, text, fontsize=9, color=COLORS['text'], linespacing=1.4)
        y -= 0.25

    plt.tight_layout()
    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_methodology_page(pdf):
    """Create methodology description page."""
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')

    ax.text(0.5, 0.92, 'Methodology', fontsize=24, fontweight='bold',
            ha='center', color=COLORS['primary'])

    # Experimental design
    ax.text(0.08, 0.82, 'Experimental Design', fontsize=14, fontweight='bold', color=COLORS['text'])
    ax.text(0.08, 0.75,
            '• Within-subjects design: Same student experiences both conditions\n'
            '• Control: Traditional symbolic ε-N definition presentation\n'
            '• Treatment: Interactive simulation walkthrough description\n'
            '• Metric: Self-reported confidence score (0-10) + qualitative insights',
            fontsize=10, color=COLORS['neutral'], linespacing=1.6)

    # Agent design
    ax.text(0.08, 0.55, 'AI Student Agent Design', fontsize=14, fontweight='bold', color=COLORS['text'])
    ax.text(0.08, 0.48,
            '• 15 unique student personas with distinct cognitive profiles\n'
            '• Personas based on real student archetypes from classroom experience\n'
            '• Each agent has explicit learning style, prior knowledge, and blind spots\n'
            '• Agents instructed to respond authentically, not ideally',
            fontsize=10, color=COLORS['neutral'], linespacing=1.6)

    # Limitations
    ax.text(0.08, 0.28, 'Limitations', fontsize=14, fontweight='bold', color=COLORS['negative'])
    ax.text(0.08, 0.21,
            '• AI proxies may not fully replicate human cognition\n'
            '• Some responses flagged as "idealized" (Amy, Luna)\n'
            '• Needs validation against real student testing\n'
            '• Treatment was description of simulation, not actual interaction',
            fontsize=10, color=COLORS['neutral'], linespacing=1.6)

    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

def create_results_table(pdf):
    """Create detailed results table page."""
    fig, ax = plt.subplots(figsize=(11, 8.5))
    ax.axis('off')

    ax.text(0.5, 0.95, 'Detailed Results Table', fontsize=20, fontweight='bold',
            ha='center', color=COLORS['primary'])

    # Create table
    columns = ['Student', 'Profile', 'Control', 'Treatment', 'Δ', 'Key Insight']

    table_data = []
    for s in TARGET_AUDIENCE:
        delta = s['treatment'] - s['control']
        delta_str = f"+{delta:.2f}" if delta > 0 else f"{delta:.2f}"
        insight = s['insight'][:35] + '...' if s['insight'] and len(s['insight']) > 35 else (s['insight'] or '—')
        table_data.append([s['name'], s['profile'], f"{s['control']:.1f}",
                          f"{s['treatment']:.2f}", delta_str, insight])

    table = ax.table(cellText=table_data,
                     colLabels=columns,
                     loc='center',
                     cellLoc='center',
                     colWidths=[0.1, 0.15, 0.08, 0.1, 0.07, 0.35])

    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1.2, 1.8)

    # Style the table
    for i, key in enumerate(table.get_celld().keys()):
        cell = table.get_celld()[key]
        if key[0] == 0:  # Header row
            cell.set_text_props(fontweight='bold', color='white')
            cell.set_facecolor(COLORS['primary'])
        else:
            cell.set_facecolor('#16213e')
            cell.set_text_props(color='white')
        cell.set_edgecolor('#444444')

    pdf.savefig(fig, facecolor=fig.get_facecolor())
    plt.close(fig)

# =============================================================================
# MAIN FUNCTION
# =============================================================================

def generate_report(output_path='ai_classroom_report.pdf'):
    """Generate the complete PDF report."""
    setup_dark_style()

    with PdfPages(output_path) as pdf:
        print("Generating AI Classroom Experiment Report...")

        print("  → Title page")
        create_title_page(pdf)

        print("  → Executive summary")
        create_executive_summary(pdf)

        print("  → Improvement chart")
        create_improvement_chart(pdf)

        print("  → Before/after comparison")
        create_before_after_chart(pdf)

        print("  → Profile breakdown")
        create_profile_breakdown(pdf)

        print("  → Results table")
        create_results_table(pdf)

        print("  → Actionable insights")
        create_insights_page(pdf)

        print("  → Non-target comparison")
        create_non_target_comparison(pdf)

        print("  → Methodology")
        create_methodology_page(pdf)

    print(f"\n✓ Report saved to: {output_path}")
    return output_path

if __name__ == '__main__':
    import os

    # Save to project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    output_path = os.path.join(project_root, 'ai_classroom_report.pdf')

    generate_report(output_path)
