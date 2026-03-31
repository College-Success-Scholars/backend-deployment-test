"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Bookmark,
  BookmarkCheck,
  Filter,
  ChevronDown,
  ExternalLink,
  Flag,
  X,
  Calendar,
  Building,
  Tag,
  Loader2,
  RefreshCw,
  Briefcase,
} from "lucide-react"

// Types
interface Opportunity {
  id: string
  company: string
  title: string
  tags: string[]
  datePosted: string
  expiryDate: string
  description: string
  jobUrl: string
  // Client-side only: toggled/bookmarked by the UI (API may not return it).
  bookmarked?: boolean
}

interface AddOpportunityForm {
  company: string
  title: string
  description: string
  tags: string
  jobUrl: string
  expiryDate: string
}

// Mock data
const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    company: "Google",
    title: "Software Engineering Intern",
    tags: ["Software", "Internship", "Remote"],
    datePosted: "2024-01-15",
    expiryDate: "2024-03-15",
    description: "Join our team as a Software Engineering Intern and work on cutting-edge projects. You'll collaborate with experienced engineers and contribute to products used by billions of people worldwide.",
    jobUrl: "https://careers.google.com/jobs/results/123456",
  },
  {
    id: "2",
    company: "Microsoft",
    title: "Product Management Intern",
    tags: ["Product", "Management", "Internship"],
    datePosted: "2024-01-20",
    expiryDate: "2024-04-01",
    description: "Gain hands-on experience in product management at Microsoft. Work on real products and learn from industry leaders in a collaborative environment.",
    jobUrl: "https://careers.microsoft.com/us/en/job/123456",
  },
  {
    id: "3",
    company: "Apple",
    title: "Design Intern",
    tags: ["Design", "UX", "Internship"],
    datePosted: "2024-01-25",
    expiryDate: "2024-03-30",
    description: "Work with Apple's design team to create beautiful, intuitive user experiences. This internship offers the chance to work on products that shape how people interact with technology.",
    jobUrl: "https://jobs.apple.com/en-us/details/123456",
  },
  {
    id: "4",
    company: "Meta",
    title: "Data Science Intern",
    tags: ["Data Science", "Machine Learning", "Internship"],
    datePosted: "2024-02-01",
    expiryDate: "2024-04-15",
    description: "Join Meta's data science team to work on large-scale machine learning problems. Gain experience with cutting-edge AI technologies and massive datasets.",
    jobUrl: "https://www.metacareers.com/jobs/123456",
  },
]

// Filter options - will be populated from API data
const getUniqueTags = (opportunities: Opportunity[]) => {
  const allTags = opportunities.flatMap(opp => opp.tags)
  return Array.from(new Set(allTags)).sort()
}

const getUniqueCompanies = (opportunities: Opportunity[]) => {
  const allCompanies = opportunities.map(opp => opp.company)
  return Array.from(new Set(allCompanies)).sort()
}

export default function InternshipBoardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    tag: "",
    company: "",
    datePosted: "",
    bookmarked: false,
  })
  const [addForm, setAddForm] = useState<AddOpportunityForm>({
    company: "",
    title: "",
    description: "",
    tags: "",
    jobUrl: "",
    expiryDate: "",
  })
  const [tagSearch, setTagSearch] = useState("")
  const [companySearch, setCompanySearch] = useState("")

  // Fetch internship opportunities from API
  const fetchOpportunities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 [DEBUG] Starting API fetch to: http://localhost:8000/internship-opportunities')
      
      const response = await fetch('http://localhost:8000/internship-opportunities')
      
      console.log('📡 [DEBUG] API Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      })
      
      if (!response.ok) {
        console.error('❌ [DEBUG] API request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        })
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Get raw response text first to debug structure
      const rawText = await response.text()
      console.log('📄 [DEBUG] Raw API response text:', rawText)
      console.log('📏 [DEBUG] Response text length:', rawText.length)
      console.log('🔍 [DEBUG] Response text type:', typeof rawText)
      
      // Parse JSON and log structure
      let data
      try {
        data = JSON.parse(rawText)
        console.log('✅ [DEBUG] Successfully parsed JSON')
        console.log('📊 [DEBUG] Parsed data type:', typeof data)
        console.log('📊 [DEBUG] Parsed data is array:', Array.isArray(data))
        console.log('📊 [DEBUG] Parsed data length:', Array.isArray(data) ? data.length : 'N/A')
        console.log('📋 [DEBUG] Full parsed data structure:', JSON.stringify(data, null, 2))
        
        if (Array.isArray(data) && data.length > 0) {
          console.log('🔍 [DEBUG] First item structure:', JSON.stringify(data[0], null, 2))
          console.log('🔍 [DEBUG] First item keys:', Object.keys(data[0]))
          console.log('🔍 [DEBUG] First item types:', {
            id: typeof data[0].id,
            company: typeof data[0].company,
            title: typeof data[0].title,
            tags: typeof data[0].tags,
            datePosted: typeof data[0].datePosted,
            expiryDate: typeof data[0].expiryDate,
            description: typeof data[0].description,
            jobUrl: typeof data[0].jobUrl
          })
        }
      } catch (parseError) {
        console.error('❌ [DEBUG] JSON parse error:', parseError)
        console.error('❌ [DEBUG] Raw text that failed to parse:', rawText)
        throw new Error(`Failed to parse JSON response: ${parseError}`)
      }
      
      // Validate data structure
      if (!Array.isArray(data)) {
        console.error('❌ [DEBUG] Expected array but got:', typeof data)
        throw new Error('API response is not an array')
      }
      
      console.log('🔄 [DEBUG] Starting data transformation...')
      
      // Transform API data to match our Opportunity interface
      const transformedData: Opportunity[] = data.map((item: Opportunity, index: number) => {
        console.log(`🔧 [DEBUG] Transforming item ${index}:`, item)
        
        const transformed = {
          id: item.id,
          company: item.company,
          title: item.title,
          tags: item.tags,
          datePosted: item.datePosted,
          expiryDate: item.expiryDate,
          description: item.description,
          jobUrl: item.jobUrl,
          bookmarked: false, // Default to false since API doesn't include this
        }
        
        console.log(`✅ [DEBUG] Transformed item ${index}:`, transformed)
        return transformed
      })
      
      console.log('🎯 [DEBUG] Final transformed data:', transformedData)
      console.log('📊 [DEBUG] Total opportunities after transformation:', transformedData.length)
      
      setOpportunities(transformedData)
      
      console.log('✅ [DEBUG] Successfully set opportunities in state')
      
    } catch (err) {
      console.error('❌ [DEBUG] Error in fetchOpportunities:', err)
      console.error('❌ [DEBUG] Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : 'No stack trace'
      })
      
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities')
      // Don't fallback to mock data - show empty state instead
      setOpportunities([])
    } finally {
      setLoading(false)
      console.log('🏁 [DEBUG] fetchOpportunities completed, loading set to false')
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchOpportunities()
  }, [])

  // Filter opportunities (API-backed state; mock is unused here)
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (filters.tag && !opp.tags.includes(filters.tag)) return false
      if (filters.company && opp.company !== filters.company) return false
      if (filters.datePosted) {
        const postedDate = new Date(opp.datePosted)
        const filterDate = new Date(filters.datePosted)
        if (postedDate < filterDate) return false
      }
      return true
    })
  }, [opportunities, filters])

  // Get unique tags and companies from opportunities
  const tagOptions = useMemo(() => getUniqueTags(opportunities), [opportunities])
  const companyOptions = useMemo(() => getUniqueCompanies(opportunities), [opportunities])

  // Filter tags and companies based on search
  const filteredTags = useMemo(() => {
    if (!tagSearch) return tagOptions
    return tagOptions.filter(tag => 
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    )
  }, [tagSearch, tagOptions])

  const filteredCompanies = useMemo(() => {
    if (!companySearch) return companyOptions
    return companyOptions.filter(company => 
      company.toLowerCase().includes(companySearch.toLowerCase())
    )
  }, [companySearch, companyOptions])

  // Handle bookmark toggle
  const toggleBookmark = (id: string) => {
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === id ? { ...opp } : opp
      )
    )
  }

  // Handle add opportunity
  const handleAddOpportunity = () => {
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      company: addForm.company,
      title: addForm.title,
      tags: addForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      datePosted: new Date().toISOString().split("T")[0],
      expiryDate: addForm.expiryDate,
      description: addForm.description,
      jobUrl: addForm.jobUrl,
    }
    
    setOpportunities(prev => [newOpportunity, ...prev])
    setAddForm({
      company: "",
      title: "",
      description: "",
      tags: "",
      jobUrl: "",
      expiryDate: "",
    })
    setShowAddModal(false)
  }

  // Handle report opportunity
  const handleReportOpportunity = (reason: string) => {
    if (selectedOpportunity) {
      setOpportunities(prev => prev.filter(opp => opp.id !== selectedOpportunity.id))
      setSelectedOpportunity(null)
      setShowReportModal(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internship Board</h1>
          <p className="text-muted-foreground">
            Discover and manage internship opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchOpportunities}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Opportunity</DialogTitle>
              <DialogDescription>
                Share an internship opportunity with the community
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={addForm.company}
                    onChange={(e) => setAddForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Position Title *</Label>
                  <Input
                    id="title"
                    value={addForm.title}
                    onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter position title"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job Posting URL *</Label>
                <Input
                  id="jobUrl"
                  value={addForm.jobUrl}
                  onChange={(e) => setAddForm(prev => ({ ...prev, jobUrl: e.target.value }))}
                  placeholder="https://company.com/jobs/123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={addForm.tags}
                    onChange={(e) => setAddForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Software, Internship, Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Application Deadline</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={addForm.expiryDate}
                    onChange={(e) => setAddForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the opportunity..."
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddOpportunity}
                disabled={!addForm.company || !addForm.title || !addForm.jobUrl || !addForm.description}
              >
                Add Opportunity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Bookmarked Filter */}
        <Button
          variant={filters.bookmarked ? "default" : "outline"}
          onClick={() => setFilters(prev => ({ ...prev, bookmarked: !prev.bookmarked }))}
          className="flex items-center gap-2"
        >
          <Bookmark className="w-4 h-4" />
          Bookmarked
        </Button>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2">
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="h-8"
              />
            </div>
            <DropdownMenuItem onClick={() => {
              setFilters(prev => ({ ...prev, tag: "" }))
              setTagSearch("")
            }}>
              All Tags
            </DropdownMenuItem>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, tag }))
                    setTagSearch("")
                  }}
                >
                  {tag}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No tags found
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Company Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2">
              <Input
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="h-8"
              />
            </div>
            <DropdownMenuItem onClick={() => {
              setFilters(prev => ({ ...prev, company: "" }))
              setCompanySearch("")
            }}>
              All Companies
            </DropdownMenuItem>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <DropdownMenuItem
                  key={company}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, company }))
                    setCompanySearch("")
                  }}
                >
                  {company}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No companies found
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Posted Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Posted
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, datePosted: "" }))}>
              All Time
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const date = new Date()
              date.setDate(date.getDate() - 1)
              setFilters(prev => ({ ...prev, datePosted: date.toISOString().split('T')[0] }))
            }}>
              Last 24 hours
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const date = new Date()
              date.setDate(date.getDate() - 7)
              setFilters(prev => ({ ...prev, datePosted: date.toISOString().split('T')[0] }))
            }}>
              Last 7 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const date = new Date()
              date.setDate(date.getDate() - 30)
              setFilters(prev => ({ ...prev, datePosted: date.toISOString().split('T')[0] }))
            }}>
              Last 30 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const date = new Date()
              date.setDate(date.getDate() - 90)
              setFilters(prev => ({ ...prev, datePosted: date.toISOString().split('T')[0] }))
            }}>
              Last 90 days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Opportunities Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading opportunities...</span>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Briefcase className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {error ? "Unable to load opportunities" : "No opportunities found"}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {error 
                  ? "We encountered an issue while loading internship opportunities. Please try refreshing the page."
                  : "No internship opportunities match your current filters. Try adjusting your search criteria or check back later for new postings."
                }
              </p>
              {error && (
                <Button
                  variant="outline"
                  onClick={fetchOpportunities}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opportunity) => (
                <TableRow 
                  key={opportunity.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      {opportunity.company}
                    </div>
                  </TableCell>
                  <TableCell>{opportunity.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {opportunity.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{opportunity.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(opportunity.datePosted).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(opportunity.id)
                      }}
                    >
                      {opportunity.bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Opportunity Detail Modal */}
      <Dialog open={!!selectedOpportunity} onOpenChange={() => setSelectedOpportunity(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOpportunity && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedOpportunity.company}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      <a
                        href={selectedOpportunity.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {selectedOpportunity.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(selectedOpportunity.id)
                      }}
                    >
                      {selectedOpportunity.bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                    <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Opportunity</DialogTitle>
                          <DialogDescription>
                            Help us maintain quality by reporting issues with this opportunity
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Reason for reporting</Label>
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleReportOpportunity("No longer available")}
                              >
                                No longer available
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleReportOpportunity("Broken link")}
                              >
                                Broken link
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleReportOpportunity("Duplicate")}
                              >
                                Duplicate opportunity
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowReportModal(false)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted: {new Date(selectedOpportunity.datePosted).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Expires: {new Date(selectedOpportunity.expiryDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <p className="text-sm leading-relaxed">
                    {selectedOpportunity.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}