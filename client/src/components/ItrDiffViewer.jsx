import React, { useState, useEffect } from 'react';
import { diff } from 'deep-diff';

const ItrDiffViewer = () => {
  const [actualJson, setActualJson] = useState(null);
  const [generatedJson, setGeneratedJson] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [differences, setDifferences] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Section descriptions for common ITR sections
  const sectionDescriptions = {
    CreationInfo: "Form Creation Information",
    Form_ITR2: "ITR-2 Form Information",
    PartA_GEN1: "General Information",
    "PartB-TI": "Computation of Total Income",
    PartB_TTI: "Computation of Tax Liability on Total Income",
    Schedule112A: "Long-term Capital Gains on Sale of Equity Shares or Units",
    ScheduleAL: "Statement of Assets and Liabilities",
    ScheduleAMTC: "Minimum Alternate Tax Credit",
    ScheduleBFLA: "Break-up of Fee for Late Filing of Return",
    ScheduleCFL: "Capital Gains and Losses Carry Forward",
    ScheduleCGFor23: "Capital Gains for FY 2022-23",
    ScheduleCYLA: "Current Year Loss Adjustment",
    ScheduleEI: "Exempt Income",
    ScheduleFA: "Foreign Assets",
    ScheduleHP: "Income from House Property",
    ScheduleIT: "Tax Payments",
    ScheduleOS: "Income from Other Sources",
    ScheduleS: "Details of Income from Salary",
    ScheduleSI: "Statement of Income",
    ScheduleTCS: "Tax Collected at Source",
    ScheduleTDS1: "Tax Deducted at Source from Salary",
    ScheduleTDS2: "Tax Deducted at Source on Income Other Than Salary",
    ScheduleTDS3: "TDS on Income from Other Sources",
    ScheduleTR1: "Tax Relief Details",
    ScheduleVDA: "Virtual Digital Assets",
    ScheduleVIA: "Deductions Under Chapter VI-A",
    Verification: "Verification and Declaration Information",
    ScheduleBP: "Business and Profession Income",
    ScheduleCG: "Capital Gains",
    ScheduleDI: "Details of Income",
    ScheduleIF: "Information from Balance Sheet",
    ScheduleTR: "Summary of Tax Relief",
    ScheduleVI: "Verification Information"
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assumes JSON files are copied to the 'public' directory
        const actualPath = '/itr-actual-ay-2024-25.json';
        const generatedPath = '/generated-itr-ay-2024-25.json';

        const [actualResponse, generatedResponse] = await Promise.all([
          fetch(actualPath),
          fetch(generatedPath)
        ]);

        if (!actualResponse.ok) {
          throw new Error(`Failed to fetch ${actualPath}: ${actualResponse.statusText}`);
        }
        if (!generatedResponse.ok) {
          throw new Error(`Failed to fetch ${generatedPath}: ${generatedResponse.statusText}`);
        }

        const [actualData, generatedData] = await Promise.all([
          actualResponse.json(),
          generatedResponse.json()
        ]);

        setActualJson(actualData);
        setGeneratedJson(generatedData);

        // Extract all top-level sections from both JSON structures
        const actualSectionsKeys = Object.keys(actualData.ITR.ITR2 || {});
        const generatedSectionsKeys = Object.keys(generatedData.ITR.ITR2 || {});
        
        // Combine unique keys from both sources and sort alphabetically
        const allSectionsKeys = [...new Set([...actualSectionsKeys, ...generatedSectionsKeys])].sort();
        
        console.log("Available sections:", allSectionsKeys); // For debugging purposes
        setSections(allSectionsKeys);
        
        // Set default section to ScheduleOS if it exists
        if (allSectionsKeys.includes('ScheduleOS')) {
          setSelectedSection('ScheduleOS');
        }
      } catch (err) {
        console.error("Error loading ITR JSON data:", err);
        setError(`Error loading data: ${err.message}. Make sure the JSON files exist in the client/public directory.`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Run once on mount

  const getActualSelectedSectionData = () => {
    let section = actualJson.ITR.ITR2[selectedSection] ?? {};
    //sort section by keys only one level deep
    const sortedSection = Object.keys(section).sort().reduce((obj, key) => {
      obj[key] = section[key];
      return obj;
    }, {});
    return sortedSection;
  }

  const getGeneratedSelectedSectionData = () => {
    let section = generatedJson.ITR.ITR2[selectedSection] ?? {};
    //sort section by keys only one level deep
    const sortedSection = Object.keys(section).sort().reduce((obj, key) => {
      obj[key] = section[key];
      return obj;
    }, {});
    return sortedSection;
  }

  useEffect(() => {
    if (selectedSection && actualJson !== null && generatedJson !== null) {
      try {
        const actualSectionData = getActualSelectedSectionData();
        const generatedSectionData = getGeneratedSelectedSectionData();
        console.log("Actual section data:", actualSectionData);
        console.log("Generated section data:", generatedSectionData);

        // Calculate differences using deep-diff
        const diffs = diff(actualSectionData, generatedSectionData);
        console.log("Differences:", diffs);
        setDifferences(diffs || []);
      } catch (err) {
        console.error(`Error generating diff for section ${selectedSection}:`, err);
        setError(`Error generating diff: ${err.message}`);
      }
    } else {
      setDifferences([]); // Clear diff if no section selected or data not loaded
    }
  }, [selectedSection, actualJson, generatedJson]);

  // Convert JSON to formatted string with line numbers
  const formatJsonWithLineNumbers = (json) => {
    if (!json) return [];
    const lines = JSON.stringify(json, null, 2).split('\n');
    return lines.map((line, index) => ({
      number: index + 1,
      content: line
    }));
  };

  // Prepare side-by-side diff view data
  const getSideBySideDiff = () => {
    if (!selectedSection || !actualJson || !generatedJson) {
      return { left: [], right: [] };
    }

    const leftJson = getActualSelectedSectionData();
    const rightJson = getGeneratedSelectedSectionData();
    
    const leftLines = formatJsonWithLineNumbers(leftJson);
    const rightLines = formatJsonWithLineNumbers(rightJson);
    
    // Create a map of diff changes for highlighting
    const diffMap = {};
    
    if (differences) {
      differences.forEach(diff => {
        if (!diff.path) return;
        
        const pathStr = Array.isArray(diff.path) ? diff.path.join('.') : diff.path.toString();
        
        switch (diff.kind) {
          case 'E': // Changed
            diffMap[pathStr] = { type: 'changed', lhs: diff.lhs, rhs: diff.rhs };
            break;
          case 'N': // Added
            diffMap[pathStr] = { type: 'added', value: diff.rhs };
            break;
          case 'D': // Deleted
            diffMap[pathStr] = { type: 'deleted', value: diff.lhs };
            break;
          case 'A': // Array change
            const arrayPath = `${pathStr}[${diff.index}]`;
            if (diff.item.kind === 'N') {
              diffMap[arrayPath] = { type: 'added', value: diff.item.rhs };
            } else if (diff.item.kind === 'D') {
              diffMap[arrayPath] = { type: 'deleted', value: diff.item.lhs };
            } else if (diff.item.kind === 'E') {
              diffMap[arrayPath] = { type: 'changed', lhs: diff.item.lhs, rhs: diff.item.rhs };
            }
            break;
          default:
            break;
        }
      });
    }
    
    // Simple approach to mark lines - in a more sophisticated version we would need
    // to more precisely track which lines correspond to which paths
    const getHighlightedLine = (line, isLeft) => {
      // This is a simplified approach - real implementation would need to parse JSON to know exactly which lines to highlight
      const lineContent = line.content.trim();
      
      // Look for lines that might contain changed values
      for (const path in diffMap) {
        const diff = diffMap[path];
        const searchValue = isLeft 
          ? (diff.lhs !== undefined ? JSON.stringify(diff.lhs).replace(/"/g, '') : null)
          : (diff.rhs !== undefined ? JSON.stringify(diff.rhs).replace(/"/g, '') : null);
          
        if (searchValue && lineContent.includes(searchValue)) {
          if (diff.type === 'changed') {
            return { ...line, highlight: 'changed' };
          } else if (diff.type === 'added' && !isLeft) {
            return { ...line, highlight: 'added' };
          } else if (diff.type === 'deleted' && isLeft) {
            return { ...line, highlight: 'deleted' };
          }
        }
        
        // Look for lines that might contain the path itself
        const lastPathPart = path.split('.').pop();
        if (lastPathPart && lineContent.includes(lastPathPart)) {
          if (diff.type === 'changed') {
            return { ...line, highlight: 'changed' };
          } else if (diff.type === 'added' && !isLeft) {
            return { ...line, highlight: 'added' };
          } else if (diff.type === 'deleted' && isLeft) {
            return { ...line, highlight: 'deleted' };
          }
        }
      }
      
      return { ...line, highlight: null };
    };
    
    const highlightedLeftLines = leftLines.map(line => getHighlightedLine(line, true));
    const highlightedRightLines = rightLines.map(line => getHighlightedLine(line, false));
    
    return {
      left: highlightedLeftLines,
      right: highlightedRightLines
    };
  };

  const { left, right } = getSideBySideDiff();

  if (loading) {
    return <div>Loading JSON data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>ITR JSON Diff Viewer (AY 2024-25)</h2>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="section-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Section:</label>
        <select
          id="section-select"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          style={{ padding: '8px', minWidth: '300px', fontSize: '16px' }}
        >
          <option value="">-- Select a Section --</option>
          {sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
        {selectedSection && (
          <button 
            onClick={() => setSelectedSection('')}
            style={{ marginLeft: '10px', padding: '8px', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </div>

      {selectedSection ? (
        <div>
          <h3>
            Comparing {selectedSection}
            {sectionDescriptions[selectedSection] && 
              <span style={{ fontWeight: 'normal', fontSize: '0.9em', marginLeft: '10px', color: '#666' }}>
                - {sectionDescriptions[selectedSection]}
              </span>
            }
          </h3>
          <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px' }}>
            {/* Left side - Original */}
            <div style={{ flex: 1, borderRight: '1px solid #ddd', overflowX: 'auto' }}>
              <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <strong>Actual JSON</strong>
              </div>
              <pre style={{ margin: 0, padding: '0', fontSize: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {left.map((line) => (
                      <tr key={`left-${line.number}`}>
                        <td 
                          style={{ 
                            padding: '0 8px', 
                            color: '#999', 
                            textAlign: 'right', 
                            userSelect: 'none',
                            backgroundColor: '#f5f5f5',
                            borderRight: '1px solid #ddd',
                            width: '40px'
                          }}
                        >
                          {line.number}.
                        </td>
                        <td 
                          style={{ 
                            padding: '0 8px', 
                            whiteSpace: 'pre',
                            backgroundColor: 
                              line.highlight === 'changed' ? '#fff8c5' : 
                              line.highlight === 'deleted' ? '#ffebe9' : 
                              'transparent'
                          }}
                        >
                          {line.content}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </pre>
            </div>
            
            {/* Right side - Modified */}
            <div style={{ flex: 1, overflowX: 'auto' }}>
              <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                <strong>Generated JSON</strong>
              </div>
              <pre style={{ margin: 0, padding: '0', fontSize: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {right.map((line) => (
                      <tr key={`right-${line.number}`}>
                        <td 
                          style={{ 
                            padding: '0 8px', 
                            color: '#999', 
                            textAlign: 'right', 
                            userSelect: 'none',
                            backgroundColor: '#f5f5f5',
                            borderRight: '1px solid #ddd',
                            width: '40px'
                          }}
                        >
                          {line.number}.
                        </td>
                        <td 
                          style={{ 
                            padding: '0 8px', 
                            whiteSpace: 'pre',
                            backgroundColor: 
                              line.highlight === 'changed' ? '#fff8c5' : 
                              line.highlight === 'added' ? '#e6ffec' : 
                              'transparent'
                          }}
                        >
                          {line.content}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </pre>
            </div>
          </div>
          
          <div style={{ marginTop: '15px', fontSize: '14px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#ffebe9', marginRight: '5px' }}></span>
                <span>Deleted</span>
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#e6ffec', marginRight: '5px' }}></span>
                <span>Added</span>
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#fff8c5', marginRight: '5px' }}></span>
                <span>Changed</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Please select a section to view differences</h3>
          <p>Available sections include top-level JSON structures like ScheduleS, ScheduleSI, etc.</p>
        </div>
      )}
    </div>
  );
};

export default ItrDiffViewer; 