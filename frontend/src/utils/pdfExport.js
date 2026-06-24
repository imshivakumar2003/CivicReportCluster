// PDF Export Utility
export const generatePDF = (complaints, fileName = 'complaints.pdf') => {
    if (!complaints || complaints.length === 0) {
        alert('No complaints to export');
        return;
    }

    let htmlContent = `
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: white; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #003399; padding-bottom: 10px; }
          .header h1 { color: #003399; margin: 0; }
          .header p { color: #666; margin: 5px 0 0 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #003399; color: white; padding: 10px; text-align: left; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          .status-pending { background: #fff3cd; color: #856404; padding: 3px 8px; border-radius: 3px; }
          .status-progress { background: #cfe2ff; color: #084298; padding: 3px 8px; border-radius: 3px; }
          .status-resolved { background: #d1e7dd; color: #0f5132; padding: 3px 8px; border-radius: 3px; }
          .priority-high { color: #dc3545; font-weight: bold; }
          .priority-medium { color: #ffc107; font-weight: bold; }
          .priority-low { color: #28a745; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Civic Report - Complaints Export</h1>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Total Complaints: ${complaints.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Submitted By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
  `;

    complaints.forEach(complaint => {
        const statusClass = `status-${complaint.status.toLowerCase().replace(' ', '-')}`;
        const priorityClass = `priority-${complaint.priority.toLowerCase()}`;
        const date = new Date(complaint.createdAt).toLocaleDateString();

        htmlContent += `
      <tr>
        <td><strong>${complaint.title}</strong></td>
        <td>${complaint.category}</td>
        <td><span class="${statusClass}">${complaint.status}</span></td>
        <td><span class="${priorityClass}">${complaint.priority}</span></td>
        <td>${complaint.userId?.name || 'Unknown'}</td>
        <td>${date}</td>
      </tr>
    `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          <p>This is an official export of the Civic Report system.</p>
          <p>For more information, contact the administration.</p>
        </div>
      </body>
    </html>
  `;

    // Create and trigger download
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export default generatePDF;
