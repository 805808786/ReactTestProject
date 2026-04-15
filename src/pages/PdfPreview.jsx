import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import PageHeader from "../components/PageHeader";
import "./PdfPreview.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function getSafeTitle(name) {
  return name || "附件预览";
}

export default function PdfPreview() {
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get("url") || "";
  const pdfName = searchParams.get("name") || "";

  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pdfUrl) {
      setError("未找到可预览的附件地址");
      setPdfDoc(null);
      return undefined;
    }

    let cancelled = false;
    let loadTask = null;

    setLoading(true);
    setError("");
    setPdfDoc(null);
    setCurrentPage(1);
    setTotalPages(0);

    fetch(pdfUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        if (cancelled) return;

        loadTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
        });

        return loadTask.promise;
      })
      .then((doc) => {
        if (!doc || cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError?.message || "PDF 加载失败");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      if (loadTask) {
        loadTask.destroy();
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return undefined;

    let cancelled = false;

    const renderPage = async () => {
      setRendering(true);
      setError("");

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (renderError) {
        if (renderError?.name !== "RenderingCancelledException" && !cancelled) {
          setError(renderError?.message || "PDF 渲染失败");
        }
      } finally {
        if (!cancelled) {
          setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [currentPage, pdfDoc, scale]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, Number((prev - 0.2).toFixed(2))));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(2.5, Number((prev + 0.2).toFixed(2))));
  };

  return (
    <div className="pdf-preview-page">
      <PageHeader title={getSafeTitle(pdfName)} />

      <div className="pdf-preview-toolbar">
        <button
          type="button"
          className="pdf-preview-btn"
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || loading}
        >
          上一页
        </button>
        <div className="pdf-preview-page-indicator">
          {totalPages ? `${currentPage} / ${totalPages}` : "-- / --"}
        </div>
        <button
          type="button"
          className="pdf-preview-btn"
          onClick={handleNextPage}
          disabled={!totalPages || currentPage >= totalPages || loading}
        >
          下一页
        </button>
        <div className="pdf-preview-toolbar-divider" />
        <button
          type="button"
          className="pdf-preview-btn"
          onClick={handleZoomOut}
          disabled={loading}
        >
          缩小
        </button>
        <div className="pdf-preview-scale">{Math.round(scale * 100)}%</div>
        <button
          type="button"
          className="pdf-preview-btn"
          onClick={handleZoomIn}
          disabled={loading}
        >
          放大
        </button>
      </div>

      <div className="pdf-preview-body">
        {loading && <div className="pdf-preview-state">PDF 加载中...</div>}
        {!loading && error && <div className="pdf-preview-state">{error}</div>}
        {!loading && !error && (
          <div className="pdf-preview-canvas-wrap">
            {rendering && (
              <div className="pdf-preview-rendering">页面渲染中...</div>
            )}
            <canvas ref={canvasRef} className="pdf-preview-canvas" />
          </div>
        )}
      </div>
    </div>
  );
}
