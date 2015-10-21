// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ReportShareCallbackObject.cs" company="Self">
//   For practice purpose only.
// </copyright>
// <summary>
//   The report share callback object.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace EvoPdfConverter
{
    using System;
    using System.IO;
    using System.Threading;

    using EvoPdf;

    /// <summary>
    /// The report share callback object.
    /// </summary>
    public class ReportShareCallbackObject
    {
        /// <summary>
        /// Creates PDF using EVO PDF utility.
        /// </summary>
        /// <param name="innerHtml">
        /// The inner html.
        /// </param>
        public void CreatePdf(string innerHtml)
        {
            this.CreatePdfEvoUtility(innerHtml);
        }

        /// <summary>
        /// Converts HTML string into PDF file using EVOPDF utility.
        /// </summary>
        /// <param name="innerHtml">
        /// The inner html.
        /// </param>
        private void CreatePdfEvoUtility(string innerHtml)
        {
            var thread = new Thread(
            new ThreadStart(
                delegate
                {
                    // Get the location to save PDF file.
                    var exportPdfFilename = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
                        "PDFTest");
                    if (!string.IsNullOrEmpty(exportPdfFilename))
                    {
                        var pdf = new PdfConverter();
                        using (Stream file = File.Create(exportPdfFilename))
                        {
                            pdf.SavePdfFromHtmlStringToStream(innerHtml, string.Format(ReportServerLocationUriFormat, this.rtviServerIp), file);
                        }
                    }

                    // Stop busy indicator
                    this.dispatcherService.BeginInvoke(DispatcherPriority.Background, () => this.UpdateStatusToView(string.Empty, false));
                }));
            thread.SetApartmentState(ApartmentState.STA);
            thread.Start();
        }
    }
}
